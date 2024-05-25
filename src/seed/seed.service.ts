import { Injectable } from '@nestjs/common';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RulesService } from 'src/rules/rules.service';
import { genSaltSync, hashSync } from 'bcrypt';
import Admin from 'src/entities/Admin';
import { UsersService } from 'src/users/users.service';
import { AdminsService } from 'src/admins/admins.service';
import { UserClass } from 'src/entities/User';

@Injectable()
export class SeedService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectDataSource('mongoDB') private readonly mongoDataSource: DataSource,
    private readonly ruleService: RulesService,
    private readonly userService: UsersService,
    private readonly adminService: AdminsService,
  ) { }

  async reset() {
    console.log('resetting...');
    await this.dataSource.synchronize(true);
    await this.mongoDataSource.synchronize(true);
    this.ruleService.createRules();

    const hashedPassword = hashSync(
      "password",
      genSaltSync(),
    );

    await this.userService.create({
      username: "user",
      password: "password",
      birth: new Date("1999-01-01"),
      email: "21522441@gm.uit.edu.vn",
      name: "Nguyễn Văn A",
      type: UserClass.X,
      address: "Đại học Công Nghệ Thông Tin, đường Hàn Thuyên, phường Linh Trung"
    })

    await this.adminService.create({
      address: "Đại học Công Nghệ Thông Tin, đường Hàn Thuyên, phường Linh Trung",
      birth: new Date("1999-01-01"),
      email: "21522441@gm.uit.edu.vn",
      name: "Nguyễn Văn B",
      password: "password",
      username: "admin",
    })
    console.log('reseting done!')

  }
}
