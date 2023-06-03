import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import BookBorrowReturnHistory from 'src/entities/BookBorrowReturnHistory';
import { Types } from 'mongoose';
import BookReturnSession from 'src/entities/BookReturnSession';

@Injectable()
export class BookBorrowReturnHistoriesService {
  constructor(
    @InjectRepository(BookBorrowReturnHistory, 'mongoDB')
    private bookBorrowReturnHistoriesRepository: MongoRepository<BookBorrowReturnHistory>,
    @InjectRepository(BookReturnSession, 'mongoDB')
    private bookReturnSessionsRepository: MongoRepository<BookReturnSession>,
  ) {}

  async findAllFromUser(userId: string) {
    return await this.bookBorrowReturnHistoriesRepository.find({
      where: {
        userId,
      },
      order: {
        borrowDate: 'DESC',
      },
    });
  }

  async getReturnSession(returnSessionId: any) {
    const sessionInfo = await this.bookReturnSessionsRepository.findOne({
      where: {
        _id: new Types.ObjectId(returnSessionId),
      },
    });

    const histories = await this.bookBorrowReturnHistoriesRepository
      .aggregate([
        {
          $match: {
            returnSessionId: new Types.ObjectId(returnSessionId),
          },
        },
        {
          $lookup: {
            from: 'book_borrow_session',
            localField: 'borrowSessionId',
            foreignField: '_id',
            as: 'borrow_session_info',
          },
        },
      ])
      .toArray();

    return { sessionInfo, info: histories };
  }
  
  async getAll() {
    return await this.bookBorrowReturnHistoriesRepository.find();
  }
}
