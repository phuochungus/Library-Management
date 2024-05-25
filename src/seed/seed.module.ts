import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { RulesModule } from 'src/rules/rules.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AdminsModule } from 'src/admins/admins.module';

@Module({
  imports: [
    AdminsModule,
    UsersModule,
    RulesModule,
    TypeOrmModule.forFeature([]),
    TypeOrmModule.forFeature([], 'mongodb')],
  controllers: [SeedController],
  providers: [SeedService]
})
export class SeedModule { }
