import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import ParseObjectIDStringPipe from 'src/pipes/parse-objectID-string.pipe';
import { BookReturnRecordsService } from './book-return-records.service';
import { CreateBookReturnRecordDto } from './dto/create-book-return-record.dto';

@Controller('book_return_records')
export class BookReturnRecordsController {
  constructor(
    private readonly bookReturnRecordsService: BookReturnRecordsService,
  ) {}

  @Post()
  create(@Body() createBookReturnRecordDto: CreateBookReturnRecordDto) {
    return this.bookReturnRecordsService.tryMakingReturnTransaction(
      createBookReturnRecordDto,
    );
  }

  @Get()
  findAll() {
    return this.bookReturnRecordsService.findAll();
  }

  @Get('/record/:id')
  findOne(@Param('id', ParseObjectIDStringPipe) id: string) {
    return this.bookReturnRecordsService.findOne(id);
  }

  @Get('/user/:id')
  async findAllReturnRecords(@Param('id', ParseUUIDPipe) userId: string) {
    return await this.bookReturnRecordsService.findAllFromUser(userId);
  }
}
