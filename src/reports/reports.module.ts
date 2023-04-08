import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Book from 'src/entities/Book';
import BookBorrowRecord from 'src/entities/BookBorrowRecord';
import BookReturnRecord from 'src/entities/BookReturnRecord';
import Genre from 'src/entities/Genre';
import BookBorrowReturnHistory from 'src/entities/BookBorrowReturnHistory';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [BookBorrowRecord, BookReturnRecord, BookBorrowReturnHistory],
      'mongoDB',
    ),
    TypeOrmModule.forFeature([Book, Genre]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
