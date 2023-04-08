import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Genre from 'src/entities/Genre';
import { Repository } from 'typeorm';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre) private genresRepository: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto) {
    try {
      const genre = {
        ...createGenreDto,
        genreId: uuidv4(),
      };
      await this.genresRepository.insert(genre);
    } catch (error) {
      if (error.errno) {
        throw new HttpException('Genre already exist', HttpStatus.CONFLICT);
      }
      throw error;
    }
  }

  async findAll() {
    let genres: Genre[] = await this.genresRepository.find();
    return genres;
  }

  async findOne(id: string) {
    const genre: Genre | null = await this.genresRepository.findOneBy({
      genreId: id,
    });
    if (genre) return genre;
    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  async update(id: string, updateGenreDto: UpdateGenreDto) {
    let genre = await this.findOne(id);
    if (!genre) return null;

    genre = { ...genre, ...updateGenreDto };
    return await this.genresRepository.save(genre);
  }

  async remove(id: string) {
    let genre = await this.findOne(id);
    if (!genre) return;

    genre.books = Promise.resolve([]);
    await this.genresRepository.save(genre);
    await this.genresRepository.delete({ genreId: id });
  }
}
