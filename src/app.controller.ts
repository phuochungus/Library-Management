import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/authentication/jwt-auth.guard';
import LocalAuthGuard from './auth/authentication/local-auth.guard';
import { Role } from './auth/authorization/role.enum';
import { Roles } from './auth/authorization/roles.decorator';
import { RolesGuard } from './auth/authorization/roles.guard';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('protected')
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getProtected(@Request() req) {
    return req.user;
  }
}
