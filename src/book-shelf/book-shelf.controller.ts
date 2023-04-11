import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { BookShelfService } from './book-shelf.service';
import { CreateBookShelfDto } from './dto/create-book-shelf.dto';
import { RemoveBookShelfDto } from './dto/remove-book-shelf.dto';
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard';
import { Role } from 'src/auth/authorization/role.enum';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { RolesGuard } from 'src/auth/authorization/roles.guard';

@Controller('book_shelf')
export class BookShelfController {
  constructor(private readonly bookShelfService: BookShelfService) {}

  @Post()
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
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
