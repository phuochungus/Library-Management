import { Test, TestingModule } from '@nestjs/testing';
import { BookBorrowSessionsService } from './book-borrow-sessions.service';

describe('BookBorrowSessionsService', () => {
  let service: BookBorrowSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookBorrowSessionsService],
    }).compile();

    service = module.get<BookBorrowSessionsService>(BookBorrowSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
