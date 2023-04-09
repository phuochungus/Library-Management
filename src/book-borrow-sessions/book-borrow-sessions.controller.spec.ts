import { Test, TestingModule } from '@nestjs/testing';
import { BookBorrowSessionsController } from './book-borrow-sessions.controller';
import { BookBorrowSessionsService } from './book-borrow-sessions.service';

describe('BookBorrowSessionsController', () => {
  let controller: BookBorrowSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookBorrowSessionsController],
      providers: [BookBorrowSessionsService],
    }).compile();

    controller = module.get<BookBorrowSessionsController>(BookBorrowSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
