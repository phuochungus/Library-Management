import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import BookBorrowReturnHistory from 'src/entities/BookBorrowReturnHistory';
import { BookBorrowReturnHistoriesController } from './book-borrow-return-histories.controller';
import { BookBorrowReturnHistoriesService } from './book-borrow-return-histories.service';
import BookReturnSession from 'src/entities/BookReturnSession';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [BookBorrowReturnHistory, BookReturnSession],
      'mongoDB',
    ),
  ],
  controllers: [BookBorrowReturnHistoriesController],
  providers: [BookBorrowReturnHistoriesService],
  exports: [BookBorrowReturnHistoriesService],
})
export class BookBorrowReturnHistoriesModule {}
