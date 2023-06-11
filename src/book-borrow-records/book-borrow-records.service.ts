import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MongoRepository,
  Repository,
  In,
  DeepPartial,
  Not,
  IsNull,
} from 'typeorm';
import { BusinessValidateService } from '../business-validate/business-validate.service';
import Book from '../entities/Book';
import BookBorrowRecord from '../entities/BookBorrowRecord';
import BookBorrowReturnHistory from '../entities/BookBorrowReturnHistory';
import BookBorrowSession from '../entities/BookBorrowSession';
import User from '../entities/User';
import { RulesService } from '../rules/rules.service';
import { CreateBookBorrowRecordDto } from './dto/create-book-borrow-record.dto';
import _ from 'lodash';

@Injectable()
export class BookBorrowRecordsService {
  constructor(
    @InjectRepository(BookBorrowRecord, 'mongoDB')
    private bookBorrowRecordsRepository: MongoRepository<BookBorrowRecord>,
    @InjectRepository(BookBorrowReturnHistory, 'mongoDB')
    private bookBorrowReturnHistoriesRepository: MongoRepository<BookBorrowReturnHistory>,
    @InjectRepository(BookBorrowSession, 'mongoDB')
    private bookBorrowSessionsRepository: MongoRepository<BookBorrowSession>,
    @InjectRepository(Book) private booksRepository: Repository<Book>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private businessValidateService: BusinessValidateService,
    private rulesService: RulesService,
  ) {}

  async makingBorrowTransaction(
    createBookBorrowRecordDto: CreateBookBorrowRecordDto,
  ) {
    const userId = createBookBorrowRecordDto.userId;
    const bookIds = createBookBorrowRecordDto.bookIds;

    let user = await this.usersRepository.findOne({
      where: { userId },
    });

    if (!user) throw new NotFoundException('User not found or deleted');

    let willBorrowBooks = await this.booksRepository.find({
      where: {
        bookId: In(bookIds),
        user: IsNull(),
        borrowedDate: IsNull(),
        reservedDate: IsNull(),
      },
      relations: { user: true, genres: true },
    });

    if (
      !(await this.businessValidateService.isUserAbleToMakeBorrowRequest(
        user,
        willBorrowBooks.length,
      ))
    )
      throw new ConflictException(
        'User unable to borrow request due to violate some rules or have pass due books',
      );

    let reservedBooks = await this.booksRepository.find({
      where: {
        bookId: In(bookIds),
        user: Not(IsNull()),
        borrowedDate: IsNull(),
        reservedDate: Not(IsNull()),
      },
      relations: { user: true, genres: true },
    });

    if (willBorrowBooks.length + reservedBooks.length != bookIds.length) {
      let diff = _.difference(
        willBorrowBooks.map((e) => e.bookId),
        bookIds,
      );
      if (diff.length > 0)
        throw new ConflictException({
          bookId: diff[0],
          message: 'book not available',
        });
    }

    const borrowDue = this.rulesService.getRule('BORROW_DUE');
    if (!borrowDue)
      throw new HttpException(
        'There is an error occurred, missing borrow due value in database',
        HttpStatus.BAD_GATEWAY,
      );

    let resultPromises: Promise<DeepPartial<BookBorrowRecord>>[] = [];

    const now = new Date();
    let newSession = await this.bookBorrowSessionsRepository.save({});

    let joinBooks = [...reservedBooks, ...willBorrowBooks];

    for (let index in joinBooks) {
      this.makeBookUnavailableForUser(
        joinBooks[index],
        user,
        parseInt(borrowDue),
        now,
      );
      resultPromises = [
        ...resultPromises,
        this.bookBorrowRecordsRepository.save({
          bookId: bookIds[index],
          userId,
          borrowSessionId: newSession._id,
          createdDate: now,
          bookName: joinBooks[index].name,
          authorName: joinBooks[index].author,
          genreNames: joinBooks[index].genres.map((e) => e.name),
        }),
      ];
      this.bookBorrowReturnHistoriesRepository.save({
        userId: userId,
        author: joinBooks[index].author,
        bookId: joinBooks[index].bookId,
        bookName: joinBooks[index].name,
        borrowDate: now,
        borrowSessionId: newSession._id,
        returnDate: null,
        returnSessionId: null,
        fine: null,
        numberOfPassDueDays: null,
      });
      if (parseInt(index) == joinBooks.length - 1) {
        newSession.username = user.username;
        newSession.name = user.name;
        newSession.quantity = joinBooks.length;
        await this.bookBorrowSessionsRepository.save(newSession);
      }
    }

    await this.booksRepository.save(joinBooks);
    if (!user.firstBorrowDate) user.firstBorrowDate = now;
    await this.usersRepository.save(user);
    let result;
    await Promise.all(resultPromises)
      .then((records) => {
        result = records;
      })
      .catch(() => {
        throw new HttpException('Bad gateway', HttpStatus.BAD_GATEWAY);
      });

    return result;
  }

  private async makeBookUnavailableForUser(
    book: Book,
    user: User,
    borrowDays: number,
    borrowWhen: Date,
  ) {
    book.user = user;
    let today = borrowWhen;
    let dueDay = new Date(borrowWhen.getTime());
    book.borrowedDate = today;
    dueDay.setDate(book.borrowedDate.getDate() + borrowDays);
    book.dueDate = dueDay;
    let userBooks = await user.books;
    userBooks.push(book);
  }

  async findAll() {
    return await this.bookBorrowRecordsRepository.find({
      order: { createdDate: 'DESC' },
    });
  }

  async findAllFromUser(userId: string) {
    return await this.bookBorrowRecordsRepository.find({
      where: { userId },
      order: { createdDate: 'DESC' },
    });
  }

  async findOne(recordId: string) {
    const record = await this.bookBorrowRecordsRepository.findOneBy(recordId);
    if (record) return record;
    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }
}
