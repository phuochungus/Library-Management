import {
  BadGatewayException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User, { UserClass } from 'src/entities/User';
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
import { BusinessValidateService } from 'src/business-validate/business-validate.service';
import Book from 'src/entities/Book';
import Admin from 'src/entities/Admin';
import { IsNull, MoreThan, Not, Repository } from 'typeorm';
import * as _ from 'lodash';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Book) private booksRepository: Repository<Book>,
    @InjectRepository(Admin) private adminsRepository: Repository<Admin>,

    private rulesService: RulesService,
    private configService: ConfigService,
    private mailService: MailService,
    private businessValidateService: BusinessValidateService,
  ) {}

  private salt = this.configService.get<string>('SALT');

  async create(createUserDto: CreateUserDto, isAdminCreate: boolean = false) {
    let validPeriod = this.rulesService.getRule(
      'VALID_PERIOD_BY_MONTH_OF_USER_ACCOUNT',
    );
    if (!validPeriod) throw new Error();
    if (
      (await this.usersRepository.findOneBy({
        username: createUserDto.username,
        isActive: true,
      })) ||
      (await this.adminsRepository.findOneBy({
        username: createUserDto.username,
        isActive: true,
      }))
    )
      throw new HttpException('Username is already taken', HttpStatus.CONFLICT);

    const userProfile = {
      ...createUserDto,
      birth: new Date(createUserDto.birth),
      validUntil: new Date(),
      userId: uuidv4(),
      type: isAdminCreate ? createUserDto.type : UserClass.X,
    };

    if (!this.businessValidateService.isUserAgeValid(userProfile.birth))
      throw new ConflictException('User age not available');

    userProfile.validUntil.setDate(
      userProfile.validUntil.getDate() + parseInt(validPeriod) * 30,
    );

    const hashedPassword = bcrypt.hashSync(
      createUserDto.password,
      this.salt || 15,
    );
    try {
      let result = await this.usersRepository.insert({
        ...userProfile,
        password: hashedPassword,
      });
      return await this.usersRepository.findOneBy({
        userId: result.identifiers[0].userId,
      });
    } catch (error) {
      if (error.code == 'ER_DUP_ENTRY')
        throw new ConflictException('Email or username already taken');
      throw new BadGatewayException();
    }
  }

  async findAll() {
    let users: User[] = await this.usersRepository.find();
    return users;
  }

  async findOne(id: string) {
    let user =
      (await this.usersRepository.findOne({
        where: { userId: id },
        relations: {
          bookShelf: true,
          books: true,
        },
      })) || (await this.adminsRepository.findOne({ where: { adminId: id } }));
    if (user) return user;
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let user = await this.findOne(id);
    let isExisted =
      ((await this.usersRepository.findOne({
        where: [
          {
            userId: Not(id),
            username: updateUserDto.username,
          },
          {
            userId: Not(id),
            email: updateUserDto.email,
          },
        ],
      })) ||
        (await this.adminsRepository.findOne({
          where: [
            {
              adminId: Not(id),
              username: updateUserDto.username,
            },
            {
              adminId: Not(id),
              email: updateUserDto.email,
            },
          ],
        }))) != null;
    if (!user) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    if (isExisted)
      throw new ConflictException('Username or email already taken');
    if (
      updateUserDto.birth &&
      !this.businessValidateService.isUserAgeValid(updateUserDto.birth)
    )
      throw new ConflictException('User age not available');

    if (user) {
      _.assign(user, updateUserDto);
      try {
        if (user instanceof User) return await this.usersRepository.save(user);
        else if (user instanceof Admin)
          return await this.adminsRepository.save(user);
      } catch (error) {
        if (error.errno == 1062)
          throw new ConflictException('Username or email already taken');
        throw error;
      }
    }
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOneBy({ userId: id });
    if (!user) throw new NotFoundException();
    const books = await user.books;
    if (!books) throw new ConflictException();
    user.bookShelf = Promise.resolve([]);
    await this.usersRepository.softDelete({ userId: id });
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    let user: User | Admin | null = await this.adminsRepository.findOne({
      where: { username: updatePasswordDto.username },
      select: {
        password: true,
        adminId: true,
      },
    });
    if (!user)
      user = await this.usersRepository.findOne({
        where: { username: updatePasswordDto.username },
        select: {
          password: true,
          userId: true,
        },
      });

    if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    if (!bcrypt.compareSync(updatePasswordDto.password, user.password))
      throw new HttpException('Password not correct', HttpStatus.CONFLICT);
    if (updatePasswordDto.newPassword == updatePasswordDto.password)
      throw new ConflictException(
        'New password can not be same as old password',
      );
    user.password = bcrypt.hashSync(
      updatePasswordDto.newPassword,
      this.salt || 15,
    );
    if (user instanceof User) await this.usersRepository.save(user);
    else if (user instanceof Admin) await this.adminsRepository.save(user);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDTO) {
    let user = await this.usersRepository.findOneBy({
      email: resetPasswordDto.email,
      username: resetPasswordDto.username,
    });

    if (user) {
      let randomPassword = randomBytes(5).toString('hex');
      let hashedPassword = bcrypt.hashSync(randomPassword, this.salt || 15);
      user.password = hashedPassword;
      await this.usersRepository.save(user);
      this.mailService.sendNewPassword(resetPasswordDto.email, randomPassword);
    } else {
      throw new NotFoundException(
        'Not found account with provided username and email',
      );
    }
  }

  async findAllReservedBook(userId: string) {
    let now = new Date();

    let books = await this.booksRepository.find({
      where: {
        user: {
          userId,
        },
        borrowedDate: IsNull(),
        reservedDate: Not(IsNull()),
        dueDate: MoreThan(now),
      },
    });

    return books.map((e) => {
      return {
        ...e,
        remainReserveTime:
          (e.dueDate!.getTime() - Date.now()) / (60 * 60 * 1000),
      };
    });
  }

  async getAllBorrowing(id: any) {
    const user = await this.usersRepository.findOneBy({ userId: id });
    if (!user) throw new NotFoundException('User not found');
    const books = await user.books;
    return books.filter((b) => b.borrowedDate != null);
  }
}
