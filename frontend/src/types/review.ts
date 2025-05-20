import type { User } from './auth';

export interface Review {
  id: string;
  bookId: string;
  rating: number;
  comment: string;
  user: User;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface ReviewFilters {
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}