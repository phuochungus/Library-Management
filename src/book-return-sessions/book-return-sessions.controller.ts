import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { BookReturnSessionsService } from './book-return-sessions.service';
import ParseDateStringPipe from 'src/pipes/parse-date-string.pipe';
import QueryBookReturnSessionDTO from './dto/query-book-return-session.dto';
import ParseObjectIDStringPipe from 'src/pipes/parse-objectID-string.pipe';

@Controller('book_return_sessions')
export class BookReturnSessionsController {
  constructor(
    private readonly bookReturnSessionsService: BookReturnSessionsService,
  ) {}

  @Get()
  async findAll(@Query() queryDto: QueryBookReturnSessionDTO) {
    if (!queryDto.username && !queryDto.name && !queryDto.createdDate)
      return await this.bookReturnSessionsService.findAll();
    return this.bookReturnSessionsService.findAllWithQueryParams(
      queryDto.name,
      queryDto.username,
      queryDto.createdDate,
    );
  }

  @Get('/session/:sessionId')
  async findOne(@Param('sessionId', ParseObjectIDStringPipe) sessionId: string) {
    return await this.bookReturnSessionsService.findOne(sessionId);
  }
}
