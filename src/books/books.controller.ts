import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import _ from 'lodash';
import { ReserveBookDto } from './dto/reserve-book.dto';
import { ReserveService } from './reserve/reserve.service';
import QueryBookDTO from './dto/query-book.dto';
@Controller('books')
export class BooksController {
  constructor(
    private booksService: BooksService,
    private reserveService: ReserveService,
  ) {}

  //done
  //temporary remove
  // @Roles(Role.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    await this.booksService.create(createBookDto);
  }

  //done
  //temporary remove
  // @Roles(Role.Admin, Role.User)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(@Query() queryBookDto: QueryBookDTO) {
    if (
      !queryBookDto.keywords &&
      !queryBookDto.name &&
      !queryBookDto.author &&
      !queryBookDto.genre &&
      !queryBookDto.page &&
      !queryBookDto.status
    )
      return await this.booksService.findAll();
    else
      return await this.booksService.findAllWithQueryParams(
        queryBookDto.keywords,
        queryBookDto.name,
        queryBookDto.author,
        queryBookDto.genre,
        queryBookDto.page,
        queryBookDto.status,
      );
  }

  //temporary remove
  // @Roles(Role.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('book/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.booksService.findOne(id);
  }

  //Done
  //temporary remove
  // @Roles(Role.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('book/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    await this.booksService.update(id, updateBookDto);
  }

  // temporary remove
  // @Roles(Role.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('book/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.booksService.remove(id);
  }

  @Post('/reserve')
  async reserve(@Body() reserveBookDto: ReserveBookDto) {
    await this.reserveService.ReserveBook(
      reserveBookDto.userId,
      reserveBookDto.bookId,
    );
  }

  @Delete('/reserve')
  async cancelReserve(@Body() reserveBookDto: ReserveBookDto) {
    await this.reserveService.cancelReserve(
      reserveBookDto.userId,
      reserveBookDto.bookId,
    );
  }

  //temporary remove
  // @Roles(Role.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)
}
