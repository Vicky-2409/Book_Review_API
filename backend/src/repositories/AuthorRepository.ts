// src/repositories/AuthorRepository.ts
import { IAuthorRepository, Author } from './interfaces/IAuthorRepository';
import Book from '../models/Book';

export class AuthorRepository implements IAuthorRepository {
  async getAllAuthors(): Promise<Author[]> {
    // Find all unique authors using MongoDB aggregation
    const authors = await Book.aggregate([
      { $group: { _id: "$author" } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, name: "$_id" } }
    ]);
    
    return authors;
  }
}