import { Module } from '@nestjs/common';
import { BookReturnSessionsService } from './book-return-sessions.service';
import { BookReturnSessionsController } from './book-return-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import BookReturnSession from 'src/entities/BookReturnSession';

@Module({
  imports: [TypeOrmModule.forFeature([BookReturnSession], 'mongoDB')],
  controllers: [BookReturnSessionsController],
  providers: [BookReturnSessionsService],
})
export class BookReturnSessionsModule {}
