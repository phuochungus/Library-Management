import { Test, TestingModule } from '@nestjs/testing';
import { BookReturnSessionsService } from './book-return-sessions.service';

describe('BookReturnSessionsService', () => {
  let service: BookReturnSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookReturnSessionsService],
    }).compile();

    service = module.get<BookReturnSessionsService>(BookReturnSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
