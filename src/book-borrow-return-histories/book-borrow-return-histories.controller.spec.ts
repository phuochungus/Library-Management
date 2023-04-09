import { Test, TestingModule } from '@nestjs/testing';
import { BookBorrowReturnHistoriesController } from './book-borrow-return-histories.controller';
import { BookBorrowReturnHistoriesService } from './book-borrow-return-histories.service';

describe('BookBorrowReturnHistoriesController', () => {
  let controller: BookBorrowReturnHistoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookBorrowReturnHistoriesController],
      providers: [BookBorrowReturnHistoriesService],
    }).compile();

    controller = module.get<BookBorrowReturnHistoriesController>(BookBorrowReturnHistoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
