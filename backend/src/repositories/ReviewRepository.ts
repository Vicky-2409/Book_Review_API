// src/repositories/ReviewRepository.ts
import { IReview, IReviewResponse, IReviewQueryParams } from '../interfaces/IReview';
import { IReviewRepository } from './interfaces/IReviewRepository';
import Review, { ReviewDocument } from '../models/Review';
import { IUserResponse } from '../interfaces/IUser';
import mongoose from 'mongoose';

export class ReviewRepository implements IReviewRepository {
  private async mapReviewToResponse(review: ReviewDocument): Promise<IReviewResponse> {
    await review.populate('userId');
    
    // Handle the populated user data carefully
    let user: IUserResponse;
    
    // Check if userId is populated and has the necessary properties
    if (typeof review.userId !== 'string' && review.userId && 'username' in review.userId) {
      // It's populated, extract the data
      user = {
        id: String(review.userId._id),
        username: String(review.userId.username),
        email: String(review.userId.email),
        isAdmin: Boolean(review.userId.isAdmin)
      };
    } else {
      // Fallback if not populated correctly
      user = {
        id: String(review.userId),
        username: "Unknown",
        email: "unknown@example.com",
        isAdmin: false
      };
    }
    
    return {
      id: String(review._id),
      bookId: String(review.bookId),
      rating: review.rating,
      comment: review.comment,
      user,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  async create(review: IReview): Promise<IReviewResponse> {
    const newReview = new Review(review);
    await newReview.save();
    return this.mapReviewToResponse(newReview);
  }

  async findById(id: string): Promise<IReviewResponse | null> {
    const review = await Review.findById(id);
    return review ? this.mapReviewToResponse(review) : null;
  }

  async findByBookId(bookId: string, params: IReviewQueryParams): Promise<IReviewResponse[]> {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = params;
    
    const reviews = await Review.find({ bookId })
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    return Promise.all(reviews.map(review => this.mapReviewToResponse(review)));
  }

  async findByUserAndBook(userId: string, bookId: string): Promise<IReviewResponse | null> {
    const review = await Review.findOne({ userId, bookId });
    return review ? this.mapReviewToResponse(review) : null;
  }

  async update(id: string, reviewData: Partial<IReview>): Promise<IReviewResponse | null> {
    const review = await Review.findByIdAndUpdate(id, reviewData, { new: true });
    return review ? this.mapReviewToResponse(review) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await Review.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async getAverageRatingForBook(bookId: string): Promise<number> {
    const aggregation = await Review.aggregate([
      { $match: { bookId: new mongoose.Types.ObjectId(bookId) } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } }
    ]);
    
    return aggregation.length > 0 ? aggregation[0].averageRating : 0;
  }
}