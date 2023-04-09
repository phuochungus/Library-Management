import { Test, TestingModule } from '@nestjs/testing';
import { BookBorrowReturnHistoriesService } from './book-borrow-return-histories.service';

describe('BookBorrowReturnHistoriesService', () => {
  let service: BookBorrowReturnHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookBorrowReturnHistoriesService],
    }).compile();

    service = module.get<BookBorrowReturnHistoriesService>(BookBorrowReturnHistoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
