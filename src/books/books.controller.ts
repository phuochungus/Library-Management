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
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import UpdateBookGenresDto from './dto/update-genres.dto';
import _ from 'lodash';
import { ReserveBookDto } from './dto/reserve-book.dto';
import { ReserveService } from './reserve/reserve.service';
import QueryBookDTO from './dto/query-book.dto';
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard';
import { Role } from 'src/auth/authorization/role.enum';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { RolesGuard } from 'src/auth/authorization/roles.guard';
@Controller('books')
export class BooksController {
  constructor(
    private booksService: BooksService,
    private reserveService: ReserveService,
  ) {}

  //done
  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createBookDto: CreateBookDto) {
    await this.booksService.create(createBookDto);
  }

  //done
  @Get()
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Get('book/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.booksService.findOne(id);
  }

  @Patch('book/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    await this.booksService.update(id, updateBookDto);
  }

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
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

  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/genres')
  async updateBookGenres(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGenresDto: UpdateBookGenresDto,
  ) {
    await this.booksService.updateBookGenre(id, updateGenresDto.genreNames);
  }
}
