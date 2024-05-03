import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Admin from 'src/entities/Admin';
import { Repository } from 'typeorm';
import CreateAdminDto from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin) private adminsRepository: Repository<Admin>,
    private configService: ConfigService,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    try {
      // const salt = this.configService.get<string>('SALT');
      const adminProfile = {
        ...createAdminDto,
        password: bcrypt.hashSync(createAdminDto.password, bcrypt.genSaltSync()),
        adminId: uuidv4(),
      };
      await this.adminsRepository.insert(adminProfile);
    } catch (error) {
      if (error.errno == 1062) {
        throw new HttpException(
          'Username is already taken',
          HttpStatus.CONFLICT,
        );
      }
      console.error(error);
      throw error;
    }
  }

  async findAll(): Promise<Admin[]> {
    const admins: Admin[] = await this.adminsRepository.find();
    return admins;
  }

  async findOne(id: string) {
    const admin: Admin | null = await this.adminsRepository.findOneBy({
      adminId: id,
    });
    if (admin) return admin;
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    let admin: Admin | null = await this.adminsRepository.findOneBy({
      adminId: id,
    });
    if (!admin) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    await this.adminsRepository.save({
      ...admin,
      ...updateAdminDto,
    });
  }

  async remove(id: string) {
    await this.adminsRepository.softDelete({ adminId: id });
  }
}
