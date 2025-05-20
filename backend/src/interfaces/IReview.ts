// src/interfaces/IReview.ts
import { IUserResponse } from './IUser';

export interface IReview {
  id?: string;
  bookId: string;
  userId: string;
  rating: number; // 1-5
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReviewResponse extends Omit<IReview, 'userId'> {
  id: string;
  user: IUserResponse;
}

export interface IReviewQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}