import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/bookService';
import { BookRepository } from '../repositories/BookRepository';
import { IBookQueryParams } from '../interfaces/IBook';

export class BookController {
  private bookService: BookService;

  constructor() {
    const bookRepository = new BookRepository();
    this.bookService = new BookService(bookRepository);
  }

  createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      const bookData = req.body;
      const book = await this.bookService.createBook(bookData, req.user.id);
      
      res.status(201).json({
        message: 'Book created successfully',
        book,
      });
    } catch (error) {
      next(error);
    }
  };

  getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const book = await this.bookService.getBookById(id);
      
      res.status(200).json({ book });
    } catch (error) {
      next(error);
    }
  };

  getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryParams: IBookQueryParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        genre: req.query.genre as string | undefined,
        author: req.query.author as string | undefined,
        search: req.query.search as string | undefined,
        sortBy: req.query.sortBy as 'title' | 'author' | 'publicationYear' | 'averageRating' | undefined,
        sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
      };
      const books = await this.bookService.getAllBooks(queryParams);
      
      res.status(200).json(books);
    } catch (error) {
      next(error);
    }
  };

  updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      const { id } = req.params;
      const bookData = req.body;
      const book = await this.bookService.updateBook(id, bookData, req.user.id, req.user.isAdmin);
      
      res.status(200).json({
        message: 'Book updated successfully',
        book,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      const { id } = req.params;
      await this.bookService.deleteBook(id, req.user.id, req.user.isAdmin);
      
      res.status(200).json({
        message: 'Book deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  searchBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query.query as string;
      const books = await this.bookService.searchBooks(query);
      
      res.status(200).json({
        results: books,
      });
    } catch (error) {
      next(error);
    }
  };
}