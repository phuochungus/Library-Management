import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { BookBorrowRecordsService } from 'src/book-borrow-records/book-borrow-records.service';
import { BookReturnRecordsService } from 'src/book-return-records/book-return-records.service';
import { FineReceiptsService } from 'src/fine-receipts/fine-receipts.service';
import CreateUserDto from './dto/create-user.dto';
import UpdatePasswordDto from './dto/update-password.dto';
import UpdateUserDto from './dto/update-user.dto';
import { UsersService } from './users.service';
import ResetPasswordDTO from './dto/reset-password.dto';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private bookReturnRecordsService: BookReturnRecordsService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('user/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.findOne(id);
  }

  // @Get('user/:id/return-records')
  // async findAllReturnRecords(@Param('id', ParseUUIDPipe) userId: string) {
  //   return await this.bookReturnRecordsService.findAllFromUser(userId);
  // }

  @Put('/password')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    await this.usersService.updatePassword(updatePasswordDto);
  }

  @Put('/password_reset')
  async resetPasswrod(@Body() resetPasswordDto: ResetPasswordDTO) {
    await this.usersService.resetPassword(resetPasswordDto);
  }

  @Patch('user/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.update(id, updateUserDto);
  }

  @Delete('user/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);
  }
}
