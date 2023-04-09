import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Book from 'src/entities/Book';
import BookBorrowRecord from 'src/entities/BookBorrowRecord';
import BookBorrowReturnHistory from 'src/entities/BookBorrowReturnHistory';
import BookReturnRecord from 'src/entities/BookReturnRecord';
import Genre from 'src/entities/Genre';
import { MongoRepository, Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(BookBorrowRecord, 'mongoDB')
    private bookBorrowRecordsRepository: MongoRepository<BookBorrowRecord>,
    @InjectRepository(BookReturnRecord, 'mongoDB')
    private bookReturnRecordsRepository: MongoRepository<BookReturnRecord>,
    @InjectRepository(BookBorrowReturnHistory, 'mongoDB')
    private bookBorrowReturnHistoriesRepository: MongoRepository<BookBorrowReturnHistory>,
    @InjectRepository(Genre)
    private genresRepository: Repository<Genre>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async getReportBorrowByGenres(month: number, year: number) {
    let result: Array<{ bookId: string }> =
      await this.bookBorrowRecordsRepository
        .aggregate([
          {
            $project: {
              bookId: 1,
              month: { $month: '$createdDate' },
              year: { $year: '$createdDate' },
            },
          },
          {
            $match: {
              month: month,
              year: year,
            },
          },
          {
            $project: {
              bookId: 1,
            },
          },
        ])
        .toArray();

    let count = {};
    result.forEach((element: { bookId: string }) => {
      if (count[element.bookId.toString()]) {
        count[element.bookId.toString()] += 1;
      } else count[element.bookId.toString()] = 1;
    });

    let promiseContainer: Array<Promise<void>> = [];
    let result2: { count: number; genresName: string[] }[] = [];

    for (let [key, value] of Object.entries(count)) {
      promiseContainer.push(
        this.createPromiseHandler(key, value as number, result2),
      );
    }

    await Promise.allSettled(promiseContainer);

    let result3 = {};
    let total = 0;
    for (let i in result2) {
      total += result2[i].count * result2[i].genresName.length;
      for (let j in result2[i].genresName) {
        if (result3[result2[i].genresName[j]]) {
          result3[result2[i].genresName[j]] += result2[i].count;
        } else {
          result3[result2[i].genresName[j]] = result2[i].count;
        }
      }
    }

    let result4: { genreName: string; count: number; percentage: string }[] =
      [];
    for (let [key, value] of Object.entries(result3)) {
      result4.push({
        genreName: key,
        count: value as number,
        percentage: (((value as number) * 100) / total).toPrecision(4),
      });
    }
    return result4;
  }

  async createPromiseHandler(
    bookId: string,
    count: number,
    result: { count: number; genresName: string[] }[],
  ): Promise<void> {
    try {
      let book = await this.booksRepository.findOneBy({ bookId });

      if (book) {
        result.push({
          count,
          genresName: (await book.genres).map((genre) => genre.name),
        });
      }
    } catch (error) {}
  }

  async getReportLateReturn(borrowMonth: number, borrowYear: number) {
    return await this.bookBorrowReturnHistoriesRepository
      .aggregate([
        {
          $addFields: {
            month: { $month: '$borrowDate' },
            year: { $year: '$borrowDate' },
          },
        },
        {
          $match: {
            numberOfPassDueDays: {
              $gte: 1,
            },
            month: borrowMonth,
            year: borrowYear,
          },
        },
        {
          $sort: {
            borrowDate: 1,
          },
        },
      ])
      .toArray();
  }
}
