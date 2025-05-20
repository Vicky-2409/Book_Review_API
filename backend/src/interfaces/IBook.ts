// src/interfaces/IBook.ts
import { IUserResponse } from './IUser';

export interface IBook {
  id?: string;
  title: string;
  author: string;
  description: string;
  genre: string[];
  coverImage?: string;
  isbn?: string;
  publicationYear?: number;
  publisher?: string;
  addedBy: string; // User ID
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBookResponse extends Omit<IBook, 'addedBy'> {
  id: string;
  averageRating: number;
  reviewCount: number;
  addedBy: IUserResponse;
}

export interface IBookQueryParams {
  page?: number;
  limit?: number;
  genre?: string;
  author?: string;
  search?: string;
  sortBy?: 'title' | 'author' | 'publicationYear' | 'averageRating';
  sortOrder?: 'asc' | 'desc';
}

export interface IPaginatedResponse<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}