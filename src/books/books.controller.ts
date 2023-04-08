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
import UpdateBookGenresDto from './dto/update-genres.dto';
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

  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    await this.booksService.create(createBookDto);
  }

  @Get()
  async findAll(@Query() queryBookDto: QueryBookDTO) {
    if (!queryBookDto.keywords && !queryBookDto.name && !queryBookDto.author && !queryBookDto.genre && !queryBookDto.page)
      return await this.booksService.findAll();
    else
      return await this.booksService.findAllWithQueryParams(
        queryBookDto.keywords,
        queryBookDto.name,
        queryBookDto.author,
        queryBookDto.genre,
        queryBookDto.page,
      );
  }

  @Get('book/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.booksService.findOne(id);
  }

  @Patch('book/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    await this.booksService.update(id, updateBookDto);
  }

  @Patch('/reserve')
  async reserve(@Body() reserveBookDto: ReserveBookDto) {
    await this.reserveService.ReserveBook(
      reserveBookDto.userId,
      reserveBookDto.bookId,
    );
  }

  @Delete('book/:bookId/cancel_reserve')
  async cancelReserve(
    @Body() reserveBookDto: ReserveBookDto,
    @Param('bookId', ParseUUIDPipe) bookId: string,
  ) {
    await this.reserveService.cancelReserve(reserveBookDto.userId, bookId);
  }

  @Delete('book/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.booksService.remove(id);
  }

  @Patch(':id/genres')
  async updateBookGenres(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGenresDto: UpdateBookGenresDto,
  ) {
    await this.booksService.updateBookGenre(id, updateGenresDto.genreNames);
  }
}
