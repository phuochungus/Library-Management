import { Test, TestingModule } from '@nestjs/testing';
import { BookReturnSessionsController } from './book-return-sessions.controller';
import { BookReturnSessionsService } from './book-return-sessions.service';

describe('BookReturnSessionsController', () => {
  let controller: BookReturnSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookReturnSessionsController],
      providers: [BookReturnSessionsService],
    }).compile();

    controller = module.get<BookReturnSessionsController>(BookReturnSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
