import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { BookBorrowRecordsService } from './book-borrow-records.service';
import { CreateBookBorrowRecordDto } from './dto/create-book-borrow-record.dto';
import ParseObjectIDStringPipe from '../pipes/parse-objectID-string.pipe';
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard';
import { Role } from 'src/auth/authorization/role.enum';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { RolesGuard } from 'src/auth/authorization/roles.guard';

@Controller('book_borrow_records')
export class BookBorrowRecordsController {
  constructor(
    private readonly bookBorrowRecordsService: BookBorrowRecordsService,
  ) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAllBorrowRecordsFromUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return await this.bookBorrowRecordsService.findAllFromUser(userId);
  }
}
