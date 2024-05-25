import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Rule from '../entities/Rule';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rule], 'mongoDB')],
  controllers: [RulesController],
  providers: [RulesService],
  exports: [RulesService],
})
export class RulesModule {}
