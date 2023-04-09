import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BookBorrowSession from 'src/entities/BookBorrowSession';
import { MongoRepository, ObjectLiteral } from 'typeorm';
import mongoose from 'mongoose';

@Injectable()
export class BookBorrowSessionsService {
  constructor(
    @InjectRepository(BookBorrowSession, 'mongoDB')
    private bookBorrowSessionsRepository: MongoRepository<BookBorrowSession>,
  ) {}

  async findAll() {
    return await this.bookBorrowSessionsRepository.find({
      order: { createdDate: 'DESC' },
    });
  }

  async findAllWithQueryParams(
    name: string = '',
    username: string = '',
    createdDateString: string | undefined,
  ) {
    let aggregateArray: ObjectLiteral[];
    if (createdDateString) {
      const createdDate = new Date(createdDateString);
      aggregateArray = [
        {
          $addFields: {
            day: { $dayOfMonth: '$createdDate' },
            month: { $month: '$createdDate' },
            year: { $year: '$createdDate' },
          },
        },
        {
          $match: {
            name: {
              $regex: `${name}`,
              $options: 'i',
            },
            username: {
              $regex: `${username}`,
              $options: 'i',
            },
            day: createdDate.getDate(),
            month: createdDate.getMonth() + 1,
            year: createdDate.getFullYear(),
          },
        },
      ];
    } else {
      aggregateArray = [
        {
          $addFields: {
            day: { $dayOfMonth: '$createdDate' },
            month: { $month: '$createdDate' },
            year: { $year: '$createdDate' },
          },
        },
        {
          $match: {
            name: {
              $regex: `${name}`,
              $options: 'i',
            },
            username: {
              $regex: `${username}`,
              $options: 'i',
            },
          },
        },
      ];
    }

    return await this.bookBorrowSessionsRepository
      .aggregate(aggregateArray)
      .toArray();
  }

  async findOne(sessionId: string) {
    const session = await this.bookBorrowSessionsRepository
      .aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(sessionId),
          },
        },
        {
          $lookup: {
            from: 'book_borrow_record',
            localField: '_id',
            foreignField: 'borrowSessionId',
            as: 'records',
          },
        },
      ])
      .toArray();

    return session;
  }
}
