import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Req,
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
  async create(@Req() req, @Body() createBookShelfDto: CreateBookShelfDto) {
    await this.bookShelfService.addBookToUserShelf(
      req.user.id,
      createBookShelfDto.bookId,
    );
  }

  @Get()
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAllFromUser(@Req() req) {
    return await this.bookShelfService.findAllFromUser(req.user.id);
  }

  @Delete()
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Req() req, @Body() removeBookShelfDtop: RemoveBookShelfDto) {
    await this.bookShelfService.remove(
      req.user.id,
      removeBookShelfDtop.bookIds,
    );
  }
}
