import type { User } from './auth';
import type { Review } from './review';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string[];
  coverImage?: string;
  isbn?: string;
  publicationYear?: number;
  publisher?: string;
  averageRating: number;
  reviewCount: number;
  addedBy: User;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookFormData {
  title: string;
  author: string;
  description: string;
  genre: string[];
  coverImage?: string;
  isbn?: string;
  publicationYear?: number;
  publisher?: string;
}

export interface BookDetailsWithReviews extends Book {
  reviews: Review[];
}

export interface BookFilters {
  page?: number;
  limit?: number;
  genre?: string;
  author?: string;
  search?: string;
  sortBy?: 'title' | 'author' | 'publicationYear' | 'averageRating';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedBooks {
  data: Book[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}