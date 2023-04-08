import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Rule from 'src/entities/Rule';
import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rule], 'mongoDB'),
  ],
  providers: [RulesService],
  exports: [RulesService],
  controllers: [RulesController],
})
export class RulesModule {}
