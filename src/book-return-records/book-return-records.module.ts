import { Module } from '@nestjs/common';
import { BookReturnRecordsService } from './book-return-records.service';
import { BookReturnRecordsController } from './book-return-records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import BookReturnRecord from 'src/entities/BookReturnRecord';
import Book from 'src/entities/Book';
import User from 'src/entities/User';
import { BusinessValidateModule } from 'src/business-validate/business-validate.module';
import { RulesModule } from 'src/rules/rules.module';
import BookReturnSession from 'src/entities/BookReturnSession';
import BookBorrowReturnHistory from 'src/entities/BookBorrowReturnHistory';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [BookReturnRecord, BookReturnSession, BookBorrowReturnHistory],
      'mongoDB',
    ),
    TypeOrmModule.forFeature([Book, User]),
    BusinessValidateModule,
    RulesModule,
  ],
  controllers: [BookReturnRecordsController],
  providers: [BookReturnRecordsService],
  exports: [BookReturnRecordsService],
})
export class BookReturnRecordsModule {}
