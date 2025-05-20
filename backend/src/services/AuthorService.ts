// src/services/AuthorService.ts
import { IAuthorService } from './interfaces/IAuthorService';
import { IAuthorRepository, Author } from '../repositories/interfaces/IAuthorRepository';
import { AppError } from '../middlewares/errorHandler';

export class AuthorService implements IAuthorService {
  constructor(private authorRepository: IAuthorRepository) {}

  async getAllAuthors(): Promise<Author[]> {
    try {
      return await this.authorRepository.getAllAuthors();
    } catch (error) {
      throw new AppError('Failed to fetch authors', 500);
    }
  }
}