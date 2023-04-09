import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BusinessValidateService from 'src/business-validate/business-validate.service';
import Book from 'src/entities/Book';
import BookReturnRecord from 'src/entities/BookReturnRecord';
import User from 'src/entities/User';
import { RulesService } from 'src/rules/rules.service';
import { DeepPartial, In, MongoRepository, Repository } from 'typeorm';
import { CreateBookReturnRecordDto } from './dto/create-book-return-record.dto';
import { v4 as uuid4 } from 'uuid';
import { use } from 'passport';
import { result } from 'lodash';
import BookReturnSession from 'src/entities/BookReturnSession';
import BookBorrowReturnHistory from 'src/entities/BookBorrowReturnHistory';

@Injectable()
export class BookReturnRecordsService {
  constructor(
    @InjectRepository(BookReturnRecord, 'mongoDB')
    private bookReturnRecordsRepository: MongoRepository<BookReturnRecord>,
    @InjectRepository(BookReturnSession, 'mongoDB')
    private bookReturnSessionsRepository: MongoRepository<BookReturnSession>,
    @InjectRepository(BookBorrowReturnHistory, 'mongoDB')
    private bookBorrowReturnHistoriesRepository: MongoRepository<BookBorrowReturnHistory>,
    @InjectRepository(Book) private booksRepository: Repository<Book>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private businessValidateService: BusinessValidateService,
    private rulesService: RulesService,
  ) {}
  async tryMakingReturnTransaction(
    createBookReturnRecordDto: CreateBookReturnRecordDto,
  ) {
    const userId = createBookReturnRecordDto.userId;
    const bookIds = createBookReturnRecordDto.bookIds;
    let user = await this.usersRepository.findOneBy({ userId });
    let books = await this.booksRepository.find({
      where: { bookId: In(bookIds) },
      relations: { user: true },
    });

    if (user && books.length != 0) {
      const finePerDay = this.rulesService.getRule('FINE_PER_DAY');
      if (!finePerDay)
        throw new HttpException(
          'There is an error occurred',
          HttpStatus.BAD_GATEWAY,
        );

      for (let book of books) {
        if (!this.businessValidateService.isBookBorrowedByUser(book, user))
          throw new HttpException(
            { bookId: book.bookId, message: 'book not borrow by user' },
            HttpStatus.CONFLICT,
          );
      }

      let resultPromises: Promise<DeepPartial<BookReturnRecord>>[] = [];
      let totalSessionFine = 0;
      let newSession = await this.bookReturnSessionsRepository.save({});
      const now = new Date();

      for (let index in books) {
        let book = books[index];
        let passDueDays = this.calculatePassDueDays(book);
        let fine = this.calculateFine(passDueDays, parseInt(finePerDay));

        totalSessionFine += fine;
        this.makeBookAvailable(book);
        resultPromises = [
          ...resultPromises,
          this.bookReturnRecordsRepository.save({
            bookId: book.bookId,
            userId: user.userId,
            fine,
            passDue: passDueDays,
            returnSessionId: newSession._id,
            createdDate: now,
            authorName: books[index].author,
            bookName: books[index].name,
            genreNames: books[index].genres.map((e) => e.name),
          }),
        ];

        await this.bookBorrowReturnHistoriesRepository
          .findOne({
            where: {
              bookId: books[index].bookId,
              userId: userId,
              returnDate: null,
            },
          })
          .then(async (queryResult: BookBorrowReturnHistory | null) => {
            if (!queryResult)
              throw new HttpException('Conflict', HttpStatus.CONFLICT);
            queryResult.returnDate = now;
            queryResult.returnSessionId = newSession._id;
            queryResult.fine = fine;
            queryResult.numberOfPassDueDays = passDueDays;
            await this.bookBorrowReturnHistoriesRepository.save(queryResult);
          });

        if (parseInt(index) == books.length - 1) {
          newSession.fine = totalSessionFine;
          newSession.username = user.username;
          newSession.name = user.name;
          newSession.quantity = books.length;
          await this.bookReturnSessionsRepository.save(newSession);
        }
      }

      user.totalDebt += totalSessionFine;

      await this.usersRepository.save(user);
      await this.booksRepository.save(books);

      let results;
      await Promise.all(resultPromises)
        .then((result) => {
          results = result;
        })
        .catch(() => {
          throw new HttpException('Bad gateway', HttpStatus.BAD_GATEWAY);
        });

      return results;
    }
    throw new HttpException('Transaction not valid', HttpStatus.CONFLICT);
  }

  private calculateFine(passDueDays: number, finePerDay: number) {
    const fine = passDueDays * finePerDay;
    return fine;
  }

  private makeBookAvailable(book: Book) {
    book.user = null;
    book.borrowedDate = null;
    book.dueDate = null;
  }

  async findAll() {
    return await this.bookReturnRecordsRepository.find({
      order: { createdDate: 'DESC' },
    });
  }

  async findOne(recordId: string) {
    const record = await this.bookReturnRecordsRepository.findOneBy(recordId);
    if (record) return record;
    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  async findAllFromUser(userId: string) {
    return await this.bookReturnRecordsRepository.find({
      where: { userId },
      order: { createdDate: 'DESC' },
    });
  }

  private calculatePassDueDays(book: Book) {
    const MILISECOND_IN_ONE_DAY = 1000 * 3600 * 24;
    let Difference_In_Time = Math.max(
      new Date().getTime() - book.dueDate!.getTime(),
      0,
    );
    return Math.ceil(Difference_In_Time / MILISECOND_IN_ONE_DAY);
  }
}
