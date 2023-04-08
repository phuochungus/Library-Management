import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Book from 'src/entities/Book';
import Genre from 'src/entities/Genre';
import { GenresModule } from 'src/genres/genres.module';
import User from 'src/entities/User';
import { BusinessValidateModule } from 'src/business-validate/business-validate.module';
import { RulesModule } from 'src/rules/rules.module';
import { ReserveService } from './reserve/reserve.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Genre, User]),
    GenresModule,
    BusinessValidateModule,
    RulesModule,
  ],
  controllers: [BooksController],
  providers: [BooksService, ReserveService],
  exports: [BooksService],
})
export class BooksModule {}
