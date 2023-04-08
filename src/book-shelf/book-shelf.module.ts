import { Module } from '@nestjs/common';
import { BookShelfService } from './book-shelf.service';
import { BookShelfController } from './book-shelf.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Book from 'src/entities/Book';
import User from 'src/entities/User';
import { BusinessValidateModule } from 'src/business-validate/business-validate.module';
import { RulesModule } from 'src/rules/rules.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Book]),
    BusinessValidateModule,
    RulesModule,
  ],
  controllers: [BookShelfController],
  providers: [BookShelfService],
})
export class BookShelfModule {}
