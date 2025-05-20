import { IReview, IReviewQueryParams, IReviewResponse } from '../interfaces/IReview';
import { IReviewRepository } from '../repositories/interfaces/IReviewRepository';
import { IBookRepository } from '../repositories/interfaces/IBookRepository';
import { AppError } from '../middlewares/errorHandler';

export class ReviewService {
  constructor(
    private reviewRepository: IReviewRepository,
    private bookRepository: IBookRepository
  ) {}

  async createReview(bookId: string, userId: string, rating: number, comment: string): Promise<IReviewResponse> {
    // Check if book exists
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new AppError('Book not found', 404);
    }

    // Check if user already reviewed this book
    const existingReview = await this.reviewRepository.findByUserAndBook(userId, bookId);
    if (existingReview) {
      throw new AppError('You have already reviewed this book', 409);
    }

    const review: IReview = {
      bookId,
      userId,
      rating,
      comment,
    };

    return this.reviewRepository.create(review);
  }

  async getReviewById(id: string): Promise<IReviewResponse> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    return review;
  }

  async getReviewsByBookId(bookId: string, params: IReviewQueryParams): Promise<IReviewResponse[]> {
    // Check if book exists
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new AppError('Book not found', 404);
    }

    return this.reviewRepository.findByBookId(bookId, params);
  }

  async updateReview(
    id: string,
    userId: string,
    isAdmin: boolean,
    reviewData: Partial<IReview>
  ): Promise<IReviewResponse> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    // Check authorization: only the user who created the review or an admin can update it
    if (review.user.id !== userId && !isAdmin) {
      throw new AppError('Unauthorized to update this review', 403);
    }

    const updatedReview = await this.reviewRepository.update(id, reviewData);
    if (!updatedReview) {
      throw new AppError('Failed to update review', 500);
    }

    return updatedReview;
  }

  async deleteReview(id: string, userId: string, isAdmin: boolean): Promise<boolean> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new AppError('Review not found', 404);
    }

    // Check authorization: only the user who created the review or an admin can delete it
    if (review.user.id !== userId && !isAdmin) {
      throw new AppError('Unauthorized to delete this review', 403);
    }

    return this.reviewRepository.delete(id);
  }
}