// src/repositories/BookRepository.ts
import { 
  IBook, 
  IBookResponse, 
  IBookQueryParams,
  IPaginatedResponse 
} from '../interfaces/IBook';
import { IBookRepository } from './interfaces/IBookRepository';
import Book, { BookDocument } from '../models/Book';
import Review from '../models/Review';
import mongoose from 'mongoose';
import { IUserResponse } from '../interfaces/IUser';

export class BookRepository implements IBookRepository {
  private async mapBookToResponse(book: BookDocument): Promise<IBookResponse> {
    // Calculate average rating
    const aggregation = await Review.aggregate([
      { $match: { bookId: book._id } },
      { $group: { _id: null, averageRating: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);
    
    const averageRating = aggregation.length > 0 ? aggregation[0].averageRating : 0;
    const reviewCount = aggregation.length > 0 ? aggregation[0].count : 0;
    
    // Populate user details
    await book.populate('addedBy');
    
    // Handle the populated user data carefully
    let addedBy: IUserResponse;
    
    // Check if addedBy is populated and has the necessary properties
    if (typeof book.addedBy !== 'string' && book.addedBy && 'username' in book.addedBy) {
      // It's populated, extract the data
      addedBy = {
        id: String(book.addedBy._id),
        username: String(book.addedBy.username),
        email: String(book.addedBy.email),
        isAdmin: Boolean(book.addedBy.isAdmin)
      };
    } else {
      // Fallback if not populated correctly
      addedBy = {
        id: String(book.addedBy),
        username: "Unknown",
        email: "unknown@example.com",
        isAdmin: false
      };
    }
    
    return {
      id: String(book._id),
      title: book.title,
      author: book.author,
      description: book.description,
      genre: book.genre,
      coverImage: book.coverImage,
      isbn: book.isbn,
      publicationYear: book.publicationYear,
      publisher: book.publisher,
      averageRating,
      reviewCount,
      addedBy,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    };
  }

  async create(book: IBook): Promise<IBookResponse> {
    const newBook = new Book(book);
    await newBook.save();
    return this.mapBookToResponse(newBook);
  }

  async findById(id: string): Promise<IBookResponse | null> {
    const book = await Book.findById(id);
    return book ? this.mapBookToResponse(book) : null;
  }

  async findAll(params: IBookQueryParams): Promise<IPaginatedResponse<IBookResponse>> {
    const { 
      page = 1, 
      limit = 10, 
      genre, 
      author,
      sortBy = 'title',
      sortOrder = 'asc'
    } = params;
    
    const query: any = {};
    
    if (genre) {
      query.genre = genre;
    }
    
    if (author) {
      query.author = new RegExp(author, 'i');
    }
    
    const totalCount = await Book.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    
    const books = await Book.find(query)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const bookResponses = await Promise.all(books.map(book => this.mapBookToResponse(book)));
    
    return {
      data: bookResponses,
      totalCount,
      totalPages,
      currentPage: page,
    };
  }

  async update(id: string, bookData: Partial<IBook>): Promise<IBookResponse | null> {
    const book = await Book.findByIdAndUpdate(id, bookData, { new: true });
    return book ? this.mapBookToResponse(book) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await Book.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async search(query: string): Promise<IBookResponse[]> {
    // Use MongoDB text search with text index on title and author
    const books = await Book.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });
    
    return Promise.all(books.map(book => this.mapBookToResponse(book)));
  }
}