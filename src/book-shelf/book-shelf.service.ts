import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Book from 'src/entities/Book';
import User from 'src/entities/User';
import { In, Repository } from 'typeorm';
import _ from 'lodash';
import { BusinessValidateService } from 'src/business-validate/business-validate.service';

@Injectable()
export class BookShelfService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Book) private booksRepository: Repository<Book>,
    private businessValidateService: BusinessValidateService,
  ) {}

  async addBookToUserShelf(userId: string, bookId: string) {
    let user = await this.usersRepository.findOneBy({
      userId: userId,
    });
    let book = await this.booksRepository.findOneBy({
      bookId: bookId,
    });

    if (!book) throw new NotFoundException('Book not found');
    if (!user) throw new NotFoundException('User not found');
    // if (
    //   await this.businessValidateService.isUserAbleToMakeBorrowRequest(user)
    // ) {
    let userBookShelf = await user.bookShelf;
    user.bookShelf = Promise.resolve([...userBookShelf, book]);
    await this.usersRepository.save(user);
    // } else
    //   throw new HttpException(
    //     'User not able to perform action',
    //     HttpStatus.CONFLICT,
    //   );
  }

  async findAllFromUser(userId: string) {
    const user = await this.usersRepository.findOneBy({ userId });
    if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    let userBooks = await user.bookShelf;
    return userBooks.map((e) => {
      return {
        ...e,
        isAvailable:
          this.businessValidateService.isBookAvailable(e) ||
          this.businessValidateService.isBookAvailableForUser(e, userId),
      };
    });
  }
  async remove(userId: string, bookIds: string[]) {
    let user = await this.usersRepository.findOneBy({
      userId: userId,
    });
    let book = await this.booksRepository.findBy({
      bookId: In(bookIds),
    });

    if (book.length != bookIds.length)
      throw new NotFoundException('Sone book not found');
    if (!user) throw new NotFoundException('User not found');

    let userBookShelf = await user.bookShelf;

    userBookShelf = userBookShelf.filter((e) => !bookIds.includes(e.bookId));

    user.bookShelf = Promise.resolve(userBookShelf);
    await this.usersRepository.save(user);
  }
}
