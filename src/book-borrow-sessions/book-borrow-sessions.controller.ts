import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { BookBorrowSessionsService } from './book-borrow-sessions.service';
import QueryBookBorrowSessionDTO from './dto/query-book-borrow-session.dto';
import ParseObjectIDStringPipe from 'src/pipes/parse-objectID-string.pipe';

@Controller('book_borrow_sessions')
export class BookBorrowSessionsController {
  constructor(
    private readonly bookBorrowSessionsService: BookBorrowSessionsService,
  ) {}

  @Get()
  async findAll(@Query() queryDto: QueryBookBorrowSessionDTO) {
    if (!queryDto.username && !queryDto.name && !queryDto.createdDate)
      return await this.bookBorrowSessionsService.findAll();
    return await this.bookBorrowSessionsService.findAllWithQueryParams(
      queryDto.name,
      queryDto.username,
      queryDto.createdDate,
    );
  }

  @Get('/session/:sessionId')
  async findOne(@Param('sessionId', ParseObjectIDStringPipe) sessionId: string) {
    return await this.bookBorrowSessionsService.findOne(sessionId);
  }
}
