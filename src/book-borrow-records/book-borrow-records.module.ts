import { Module } from '@nestjs/common';
import { BookBorrowRecordsService } from './book-borrow-records.service';
import { BookBorrowRecordsController } from './book-borrow-records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessValidateModule } from 'src/business-validate/business-validate.module';
import BookBorrowRecord from 'src/entities/BookBorrowRecord';
import Book from 'src/entities/Book';
import User from 'src/entities/User';
import Rule from 'src/entities/Rule';
import { RulesModule } from 'src/rules/rules.module';
import BookBorrowReturnHistory from 'src/entities/BookBorrowReturnHistory';
import BookBorrowSession from 'src/entities/BookBorrowSession';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [BookBorrowRecord, BookBorrowReturnHistory, BookBorrowSession],
      'mongoDB',
    ),
    TypeOrmModule.forFeature([Book, User]),
    BusinessValidateModule,
    RulesModule,
  ],
  controllers: [BookBorrowRecordsController],
  providers: [BookBorrowRecordsService],
  exports: [BookBorrowRecordsService],
})
export class BookBorrowRecordsModule {}
