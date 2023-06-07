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
  Req,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import _ from 'lodash';
import { ReserveBookDTOV2, ReserveBookDto } from './dto/reserve-book.dto';
import { ReserveService } from './reserve/reserve.service';
import QueryBookDTO from './dto/query-book.dto';
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard';
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
    const book = await this.booksService.create(createBookDto);
    return { ...book, isAvailable: true };
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

  @Post('/v2/reserve')
  @UseGuards(JwtAuthGuard)
  async reserveMultiple(@Req() req, @Body() reserveBookDto: ReserveBookDTOV2) {
    return await this.reserveService.ReserveMultibleBook(
      req.user.id,
      reserveBookDto.bookIds,
    );
  }

  @Delete('/reserve')
  @UseGuards(JwtAuthGuard)
  async cancelReserve(@Body() reserveBookDto: ReserveBookDto) {
    await this.reserveService.cancelReserve(
      reserveBookDto.userId,
      reserveBookDto.bookId,
    );
  }

  @Delete('/v2/reserve')
  @UseGuards(JwtAuthGuard)
  async cancelReserveV2(@Req() req, @Body() reserveBookDto: ReserveBookDTOV2) {
    return await this.reserveService.cancelReserveMultible(
      req.user.id,
      reserveBookDto.bookIds,
    );
  }
}
