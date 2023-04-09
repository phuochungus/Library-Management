import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BookBorrowReturnHistoriesService } from './book-borrow-return-histories.service';

@Controller('book_borrow_return_histories')
export class BookBorrowReturnHistoriesController {
  constructor(
    private readonly bookBorrowReturnHistoriesService: BookBorrowReturnHistoriesService,
  ) {}

  @Get('/user/:userId')
  findAllFromUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.bookBorrowReturnHistoriesService.findAllFromUser(userId);
  }
}
