import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BookShelfService } from './book-shelf.service';
import { CreateBookShelfDto } from './dto/create-book-shelf.dto';
import { RemoveBookShelfDto } from './dto/remove-book-shelf.dto';

@Controller('book_shelf')
export class BookShelfController {
  constructor(private readonly bookShelfService: BookShelfService) {}

  @Post()
  async create(@Body() createBookShelfDto: CreateBookShelfDto) {
    await this.bookShelfService.addBookToUserShelf(createBookShelfDto);
  }

  @Get('/user/:userId')
  async findAllFromUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.bookShelfService.findAllFromUser(userId);
  }

  @Delete()
  async remove(@Body() removeBookShelfDtop: RemoveBookShelfDto) {
    await this.bookShelfService.remove(removeBookShelfDtop);
  }
}
