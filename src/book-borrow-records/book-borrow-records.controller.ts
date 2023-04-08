import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BookBorrowRecordsService } from './book-borrow-records.service';
import { CreateBookBorrowRecordDto } from './dto/create-book-borrow-record.dto';
import ParseObjectIDStringPipe from '../pipes/parse-objectID-string.pipe';

@Controller('book_borrow_records')
export class BookBorrowRecordsController {
  constructor(
    private readonly bookBorrowRecordsService: BookBorrowRecordsService,
  ) {}

  @Post()
  async create(@Body() createBookBorrowRecordDto: CreateBookBorrowRecordDto) {
    return await this.bookBorrowRecordsService.makingBorrowTransaction(
      createBookBorrowRecordDto,
    );
  }

  @Get()
  async findAll() {
    return await this.bookBorrowRecordsService.findAll();
  }

  @Get('/record/:id')
  async findOne(@Param('id', ParseObjectIDStringPipe) id: string) {
    return await this.bookBorrowRecordsService.findOne(id);
  }

  @Get('/user/:userId')
  async findAllBorrowRecordsFromUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.bookBorrowRecordsService.findAllFromUser(userId);
  }
}
