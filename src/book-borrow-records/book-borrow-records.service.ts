import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BusinessValidateService from 'src/business-validate/business-validate.service';
import Book from 'src/entities/Book';
import BookBorrowRecord from 'src/entities/BookBorrowRecord';
import User from 'src/entities/User';
import { RulesService } from 'src/rules/rules.service';
import { DeepPartial, In, MongoRepository, Repository } from 'typeorm';
import { CreateBookBorrowRecordDto } from './dto/create-book-borrow-record.dto';
import BookBorrowReturnHistory from 'src/entities/BookBorrowReturnHistory';
import BookBorrowSession from 'src/entities/BookBorrowSession';

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
    let books = await this.booksRepository.find({
      where: { bookId: In(bookIds) },
      relations: { user: true, genres: true },
    });

    const maximumBorrowDay = this.rulesService.getRule('DUE_BY_DAYS');
    if (!maximumBorrowDay)
      throw new HttpException(
        'There is an error occurred',
        HttpStatus.BAD_GATEWAY,
      );

    if (
      user &&
      books.length != 0 &&
      (await this.businessValidateService.isUserAbleToMakeBorrowRequest(
        user,
      )) &&
      !this.businessValidateService.isUserReachBorrowLimit(
        await user.books,
        books.length,
      )
    ) {
      for (let index in books) {
        if (
          !this.businessValidateService.isBookAvailableForUser(
            books[index],
            userId,
          )
        )
          throw new HttpException(
            { bookId: books[index].bookId, message: 'book not available' },
            HttpStatus.CONFLICT,
          );
      }

      let resultPromises: Promise<DeepPartial<BookBorrowRecord>>[] = [];

      const now = new Date();
      let newSession = await this.bookBorrowSessionsRepository.save({});

      for (let index in books) {
        this.makeBookUnavailableForUser(
          books[index],
          user,
          parseInt(maximumBorrowDay),
          now,
        );
        resultPromises = [
          ...resultPromises,
          this.bookBorrowRecordsRepository.save({
            bookId: bookIds[index],
            userId,
            borrowSessionId: newSession._id,
            createdDate: now,
            bookName: books[index].name,
            authorName: books[index].author,
            genreNames: books[index].genres.map((e) => e.name),
          }),
        ];
        this.bookBorrowReturnHistoriesRepository.save({
          userId: userId,
          author: books[index].author,
          bookId: books[index].bookId,
          bookName: books[index].name,
          borrowDate: now,
          borrowSessionId: newSession._id,
          returnDate: null,
          returnSessionId: null,
          fine: null,
          numberOfPassDueDays: null,
        });
        if (parseInt(index) == books.length - 1) {
          newSession.username = user.username;
          newSession.name = user.name;
          newSession.quantity = books.length;
          await this.bookBorrowSessionsRepository.save(newSession);
        }
      }

      await this.booksRepository.save(books);
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
    throw new HttpException('User not valid', HttpStatus.CONFLICT);
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
