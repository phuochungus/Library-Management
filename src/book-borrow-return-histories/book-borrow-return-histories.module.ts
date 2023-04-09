import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import BookBorrowReturnHistory from "src/entities/BookBorrowReturnHistory";
import { BookBorrowReturnHistoriesController } from "./book-borrow-return-histories.controller";
import { BookBorrowReturnHistoriesService } from "./book-borrow-return-histories.service";

@Module({
  imports: [TypeOrmModule.forFeature([BookBorrowReturnHistory], 'mongoDB')],
  controllers: [BookBorrowReturnHistoriesController],
  providers: [BookBorrowReturnHistoriesService],
  exports: [BookBorrowReturnHistoriesService],
})
export class BookBorrowReturnHistoriesModule {}
