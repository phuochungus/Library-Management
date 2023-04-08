import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entities/User';
import { BookBorrowRecordsModule } from 'src/book-borrow-records/book-borrow-records.module';
import { BookReturnRecordsModule } from 'src/book-return-records/book-return-records.module';
import { FineReceiptsModule } from 'src/fine-receipts/fine-receipts.module';
import { RulesModule } from 'src/rules/rules.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MailModule,
    TypeOrmModule.forFeature([User]),
    BookBorrowRecordsModule,
    BookReturnRecordsModule,
    FineReceiptsModule,
    RulesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
