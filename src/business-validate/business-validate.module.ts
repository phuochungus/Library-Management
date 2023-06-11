import { Module } from '@nestjs/common';
import { RulesModule } from 'src/rules/rules.module';
import { BusinessValidateService } from './business-validate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import BookBorrowSession from '../entities/BookBorrowSession';

@Module({
  imports: [
    RulesModule,
    TypeOrmModule.forFeature([BookBorrowSession], 'mongoDB'),
  ],
  providers: [BusinessValidateService],
  exports: [BusinessValidateService],
})
export class BusinessValidateModule {}
