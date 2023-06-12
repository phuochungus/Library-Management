import { Module } from '@nestjs/common';
import { RulesModule } from 'src/rules/rules.module';
import { BusinessValidateService } from './business-validate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import BookBorrowSession from '../entities/BookBorrowSession';
import Book from '../entities/Book';

@Module({
  imports: [
    RulesModule,
    TypeOrmModule.forFeature([BookBorrowSession], 'mongoDB'),
    TypeOrmModule.forFeature([Book]),
  ],
  providers: [BusinessValidateService],
  exports: [BusinessValidateService],
})
export class BusinessValidateModule {}
