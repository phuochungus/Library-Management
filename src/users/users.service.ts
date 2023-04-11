import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User, { UserClass } from 'src/entities/User';
import { Repository } from 'typeorm';
import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { RulesService } from 'src/rules/rules.service';
import UpdatePasswordDto from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import ResetPasswordDTO from './dto/reset-password.dto';
import { MailService } from 'src/mail/mail.service';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private rulesService: RulesService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  private salt = this.configService.get<string>('SALT');

  async create(createUserDto: CreateUserDto) {
    let validPeriod = this.rulesService.getRule(
      'VALID_PERIOD_BY_DAY_OF_USER_ACCOUNT',
    );
    if (!validPeriod) throw new Error();
    if (
      await this.usersRepository.findOneBy({
        username: createUserDto.username,
        isActive: true,
      })
    )
      throw new HttpException('Username is already taken', HttpStatus.CONFLICT);

    const userProfile = {
      ...createUserDto,
      validUntil: new Date(),
      userId: uuidv4(),
      type: UserClass.X,
    };
    userProfile.validUntil.setDate(
      userProfile.validUntil.getDate() + parseInt(validPeriod),
    );

    const hashedPassword = bcrypt.hashSync(
      createUserDto.password,
      this.salt || 15,
    );
    await this.usersRepository.insert({
      ...userProfile,
      password: hashedPassword,
    });
  }

  async createByAdmin(createUserDto: CreateUserDto, type: UserClass) {
    let validPeriod = this.rulesService.getRule(
      'VALID_PERIOD_BY_DAY_OF_USER_ACCOUNT',
    );
    if (!validPeriod) throw new Error();
    if (
      await this.usersRepository.findOneBy({
        username: createUserDto.username,
        isActive: true,
      })
    )
      throw new HttpException('Username is already taken', HttpStatus.CONFLICT);

    const userProfile = {
      ...createUserDto,
      validUntil: new Date(),
      userId: uuidv4(),
      type,
    };
    userProfile.validUntil.setDate(
      userProfile.validUntil.getDate() + parseInt(validPeriod),
    );

    const hashedPassword = bcrypt.hashSync(
      createUserDto.password,
      this.salt || 15,
    );
    await this.usersRepository.insert({
      ...userProfile,
      password: hashedPassword,
    });
  }

  async findAll() {
    let users: User[] = await this.usersRepository.find();
    return users;
  }

  async findOne(id: string) {
    let user: User | null = await this.usersRepository.findOne({
      where: { userId: id },
      relations: {
        bookShelf: true,
        books: true,
      },
    });
    if (user) return user;
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let user = await this.usersRepository.findOneBy({ userId: id });
    if (user) {
      user = { ...user, ...updateUserDto };
      return await this.usersRepository.save(user);
    }
    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOneBy({ userId: id });
    if (!user) throw new NotFoundException();
    const books = await user.books;
    if (!books) throw new ConflictException();
    user.bookShelf = Promise.resolve([]);
    await this.usersRepository.softDelete({ userId: id });
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    userIdMakeThisAction: string,
  ) {
    let user = await this.usersRepository.findOne({
      where: { username: updatePasswordDto.username },
      select: { userId: true, password: true },
    });
    if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    if (user.userId != userIdMakeThisAction) throw new UnauthorizedException();
    if (bcrypt.compareSync(updatePasswordDto.password, user.password)) {
      user.password = bcrypt.hashSync(
        updatePasswordDto.newPassword,
        this.salt || 15,
      );
      await this.usersRepository.save(user);
      return;
    }
    throw new HttpException('Password not correct', HttpStatus.CONFLICT);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDTO) {
    let user = await this.usersRepository.findOneBy({
      email: resetPasswordDto.email,
    });

    if (user) {
      let randomPassword = randomBytes(5).toString('hex');
      let hashedPassword = bcrypt.hashSync(randomPassword, this.salt || 15);
      user.password = hashedPassword;
      await this.usersRepository.save(user);
      this.mailService.sendNewPassword(resetPasswordDto.email, randomPassword);
    }
  }
}
