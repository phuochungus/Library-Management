import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Rule from '../entities/Rule';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rule], 'mongoDB')],
  providers: [RulesService],
  exports: [RulesService],
  controllers: [RulesController],
})
export class RulesModule {}
