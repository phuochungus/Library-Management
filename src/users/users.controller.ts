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
  Request,
  Req,
  ParseBoolPipe,
} from '@nestjs/common';
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

  //done
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('/for_admin')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createByAdmin(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto, true);
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

  @Get('user/:id/reserved_book')
  async getAllReservedBookFromUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.findAllReservedBook(id);
  }

  @Get('/borrow_book/:userId')
  async getBorrowBook(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.usersService.getAllBorrowing(userId);
  }

  @Put('/password')
  // @Roles(Role.Admin, Role.User)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async updatePassword(
    @Request() req,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    await this.usersService.updatePassword(updatePasswordDto);
  }

  @Put('/password_reset')
  async resetPasswrod(@Body() resetPasswordDto: ResetPasswordDTO) {
    await this.usersService.resetPassword(resetPasswordDto);
  }

  @Patch('/me')
  @UseGuards(JwtAuthGuard)
  async updateUserSelf(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.update(req.user.id, updateUserDto);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getInfoSelf(@Req() req) {
    return await this.usersService.findOne(req.user.id);
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
