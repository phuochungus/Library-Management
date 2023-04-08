import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BookReturnSession from 'src/entities/BookReturnSession';
import { Like, MongoRepository, ObjectLiteral } from 'typeorm';

@Injectable()
export class BookReturnSessionsService {
  constructor(
    @InjectRepository(BookReturnSession, 'mongoDB')
    private bookReturnSessionsRepository: MongoRepository<BookReturnSession>,
  ) {}

  async findAll() {
    return await this.bookReturnSessionsRepository.find({
      order: { createdDate: 'DESC' },
    });
  }
  async findAllWithQueryParams(
    name: string = '',
    username: string = '',
    createdDateString?: string,
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

    return await this.bookReturnSessionsRepository
      .aggregate(aggregateArray)
      .toArray();
  }
}
