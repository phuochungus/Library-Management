import { Module } from '@nestjs/common';
import { BookBorrowSessionsService } from './book-borrow-sessions.service';
import { BookBorrowSessionsController } from './book-borrow-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import BookBorrowSession from 'src/entities/BookBorrowSession';

@Module({
  imports: [TypeOrmModule.forFeature([BookBorrowSession], 'mongoDB')],
  controllers: [BookBorrowSessionsController],
  providers: [BookBorrowSessionsService],
})
export class BookBorrowSessionsModule {}
