import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import BookBorrowReturnHistory from 'src/entities/BookBorrowReturnHistory';

@Injectable()
export class BookBorrowReturnHistoriesService {
  constructor(
    @InjectRepository(BookBorrowReturnHistory, 'mongoDB')
    private bookBorrowReturnHistoriesRepository: MongoRepository<BookBorrowReturnHistory>,
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
}
