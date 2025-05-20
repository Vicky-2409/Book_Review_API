import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/reviewService';
import { ReviewRepository } from '../repositories/ReviewRepository';
import { BookRepository } from '../repositories/BookRepository';
import { IReviewQueryParams } from '../interfaces/IReview';

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    const reviewRepository = new ReviewRepository();
    const bookRepository = new BookRepository();
    this.reviewService = new ReviewService(reviewRepository, bookRepository);
  }

  createReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      const { id: bookId } = req.params;
      const { rating, comment } = req.body;
      
      const review = await this.reviewService.createReview(
        bookId,
        req.user.id,
        rating,
        comment
      );
      
      res.status(201).json({
        message: 'Review created successfully',
        review,
      });
    } catch (error) {
      next(error);
    }
  };

  getReviewsByBookId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id: bookId } = req.params;
      
      const queryParams: IReviewQueryParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        sortBy: req.query.sortBy as 'rating' | 'createdAt' | undefined,
        sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
      };
      
      const reviews = await this.reviewService.getReviewsByBookId(bookId, queryParams);
      
      res.status(200).json({
        reviews,
      });
    } catch (error) {
      next(error);
    }
  };

  updateReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      const { id } = req.params;
      const reviewData = req.body;
      
      const review = await this.reviewService.updateReview(
        id,
        req.user.id,
        req.user.isAdmin,
        reviewData
      );
      
      res.status(200).json({
        message: 'Review updated successfully',
        review,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      
      const { id } = req.params;
      
      await this.reviewService.deleteReview(
        id,
        req.user.id,
        req.user.isAdmin
      );
      
      res.status(200).json({
        message: 'Review deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}