import { IBook, IBookQueryParams, IBookResponse, IPaginatedResponse } from '../interfaces/IBook';
import { IBookRepository } from '../repositories/interfaces/IBookRepository';
import { AppError } from '../middlewares/errorHandler';

export class BookService {
  constructor(private bookRepository: IBookRepository) {}

  async createBook(bookData: IBook, userId: string): Promise<IBookResponse> {
    const book: IBook = {
      ...bookData,
      addedBy: userId,
    };

    return this.bookRepository.create(book);
  }

  async getBookById(id: string): Promise<IBookResponse> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new AppError('Book not found', 404);
    }

    return book;
  }

  async getAllBooks(params: IBookQueryParams): Promise<IPaginatedResponse<IBookResponse>> {
    return this.bookRepository.findAll(params);
  }

  async updateBook(id: string, bookData: Partial<IBook>, userId: string, isAdmin: boolean): Promise<IBookResponse> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new AppError('Book not found', 404);
    }

    // Check authorization: only the user who added the book or an admin can update it
    if (book.addedBy.id !== userId && !isAdmin) {
      throw new AppError('Unauthorized to update this book', 403);
    }

    const updatedBook = await this.bookRepository.update(id, bookData);
    if (!updatedBook) {
      throw new AppError('Failed to update book', 500);
    }

    return updatedBook;
  }

  async deleteBook(id: string, userId: string, isAdmin: boolean): Promise<boolean> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new AppError('Book not found', 404);
    }

    // Check authorization: only the user who added the book or an admin can delete it
    if (book.addedBy.id !== userId && !isAdmin) {
      throw new AppError('Unauthorized to delete this book', 403);
    }

    return this.bookRepository.delete(id);
  }

  async searchBooks(query: string): Promise<IBookResponse[]> {
    if (!query || query.trim().length < 2) {
      throw new AppError('Search query must be at least 2 characters long', 400);
    }

    return this.bookRepository.search(query);
  }
}