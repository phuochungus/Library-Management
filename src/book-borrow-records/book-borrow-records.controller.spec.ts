import { Test, TestingModule } from '@nestjs/testing';
import { BookBorrowRecordsController } from './book-borrow-records.controller';
import { BookBorrowRecordsService } from './book-borrow-records.service';

describe('BookBorrowRecordsController', () => {
  let controller: BookBorrowRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookBorrowRecordsController],
      providers: [BookBorrowRecordsService],
    }).compile();

    controller = module.get<BookBorrowRecordsController>(BookBorrowRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
