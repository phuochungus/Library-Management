import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import Admin from 'src/entities/Admin';
import User from 'src/entities/User';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Admin) private adminsRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
      select: { username: true, password: true, userId: true },
    });
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        const { username, userId } = user;
        return { username, id: userId, roles: ['user'] };
      }
    }

    const admin = await this.adminsRepository.findOne({
      where: { username },
      select: {
        username: true,
        password: true,
        adminId: true,
      },
    });
    if (admin) {
      if (bcrypt.compareSync(password, admin.password)) {
        const { username, adminId } = admin;
        return { username, id: adminId, roles: ['admin', 'user'] };
      }
    }
    return null;
  }

  login(user: { username: string; id: string; rule: string }) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }
}
