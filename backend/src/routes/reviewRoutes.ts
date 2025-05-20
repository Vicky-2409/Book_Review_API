import express from 'express';
import { ReviewController } from '../controllers/reviewController';
import { authenticate } from '../middlewares/auth';
import { validate, reviewSchemas } from '../middlewares/validation';

const router = express.Router();
const reviewController = new ReviewController();

// Get all reviews for a book (public)
router.get('/books/:id/reviews', reviewController.getReviewsByBookId);

// Add a review for a book (protected)
router.post(
  '/books/:id/reviews',
  authenticate,
  validate(reviewSchemas.create),
  reviewController.createReview
);

// Update a review (protected)
router.put(
  '/reviews/:id',
  authenticate,
  validate(reviewSchemas.update),
  reviewController.updateReview
);

// Delete a review (protected)
router.delete(
  '/reviews/:id',
  authenticate,
  reviewController.deleteReview
);

export default router;