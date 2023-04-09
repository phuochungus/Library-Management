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
  UseGuards,
} from '@nestjs/common';
import { BookBorrowRecordsService } from 'src/book-borrow-records/book-borrow-records.service';
import { BookReturnRecordsService } from 'src/book-return-records/book-return-records.service';
import { FineReceiptsService } from 'src/fine-receipts/fine-receipts.service';
import CreateUserDto from './dto/create-user.dto';
import UpdatePasswordDto from './dto/update-password.dto';
import UpdateUserDto from './dto/update-user.dto';
import { UsersService } from './users.service';
import ResetPasswordDTO from './dto/reset-password.dto';
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard';
import { Role } from 'src/auth/authorization/role.enum';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { RolesGuard } from 'src/auth/authorization/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get('user/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.findOne(id);
  }

  @Put('/password')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    await this.usersService.updatePassword(updatePasswordDto);
  }

  @Put('/password_reset')
  async resetPasswrod(@Body() resetPasswordDto: ResetPasswordDTO) {
    await this.usersService.resetPassword(resetPasswordDto);
  }

  @Patch('user/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.update(id, updateUserDto);
  }

  @Delete('user/:id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);
  }
}
