import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Book from 'src/entities/Book';
import User from 'src/entities/User';
import { RulesModule } from 'src/rules/rules.module';
import BusinessValidateService from './business-validate.service';

@Module({
  imports: [RulesModule],
  providers: [BusinessValidateService],
  exports: [BusinessValidateService],
})
export class BusinessValidateModule {}
