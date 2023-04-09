import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Book from 'src/entities/Book';
import { Brackets, In, Like, Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { v4 as uuidv4 } from 'uuid';
import Genre from 'src/entities/Genre';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private booksRepository: Repository<Book>,
    @InjectRepository(Genre) private genresRepository: Repository<Genre>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const bookProfile = {
      ...createBookDto,
      bookId: uuidv4(),
    };
    await this.booksRepository.insert(bookProfile);
  }

  async findAll(): Promise<Book[]> {
    let books: Book[] = await this.booksRepository.find({
      relations: { user: true, genres: true },
    });
    return books;
  }

  async findAllWithQueryParams(
    keywords: string = '',
    name: string = '',
    author: string = '',
    genre: string = '',
    page: string = '0',
  ) {
    let queryBuilder = await this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.genres', 'genre')
      .where(
        new Brackets((qb) => {
          qb.where('book.bookId LIKE :bookId', { bookId: `%${keywords}%` })
            .orWhere('book.name LIKE :name', { name: `%${keywords}%` })
            .orWhere('book.author LIKE :author', { author: `%${keywords}%` });
        }),
      )
      .andWhere('book.name LIKE :name', { name: `%${name}%` })
      .andWhere('book.author LIKE :author', { author: `%${author}%` });

    if (page) queryBuilder = queryBuilder.take(15).skip(15 * parseInt(page));
    let result: Book[];
    if (genre == '') result = await queryBuilder.getMany();
    else
      result = await queryBuilder
        .andWhere('genre.name LIKE :genre', { genre: `%${genre}%` })
        .getMany();
    return result;
  }

  async findOne(id: string) {
    const book = await this.booksRepository.findOne({
      where: { bookId: id },
      relations: { user: true, genres: true },
    });
    if (book) return book;
    throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book | null> {
    let book = await this.findOne(id);
    if (!book) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    book = { ...book, ...updateBookDto };
    return await this.booksRepository.save(book);
  }

  async remove(id: string) {
    await this.booksRepository.softDelete({ bookId: id });
  }

  async updateBookGenre(bookId: string, updateGenreNamesDto: string[]) {
    let book = await this.booksRepository.findOne({
      where: { bookId },
      relations: { genres: true },
    });
    if (!book) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    const genresWillBeResolve: Genre[] = await this.genresRepository.findBy({
      name: In(updateGenreNamesDto),
    });

    book.genres = genresWillBeResolve;
    await this.booksRepository.save(book);
  }
}
