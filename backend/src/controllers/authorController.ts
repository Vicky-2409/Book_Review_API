// src/controllers/authorController.ts
import { Request, Response, NextFunction } from 'express';
import { AuthorService } from '../services/AuthorService';
import { AuthorRepository } from '../repositories/AuthorRepository';

export class AuthorController {
  private authorService: AuthorService;

  constructor() {
    const authorRepository = new AuthorRepository();
    this.authorService = new AuthorService(authorRepository);
  }

  getAuthors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authors = await this.authorService.getAllAuthors();
      res.status(200).json(authors);
    } catch (error) {
      next(error);
    }
  };
}