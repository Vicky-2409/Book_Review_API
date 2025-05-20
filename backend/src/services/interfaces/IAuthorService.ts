// src/services/interfaces/IAuthorService.ts
import { Author } from '../../repositories/interfaces/IAuthorRepository';

export interface IAuthorService {
  getAllAuthors(): Promise<Author[]>;
}