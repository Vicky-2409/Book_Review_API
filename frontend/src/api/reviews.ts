import apiClient from './client';
import type { Review, ReviewFilters, ReviewFormData } from '../types/review';

export const getReviewsByBookId = async (
  bookId: string,
  filters: ReviewFilters = {}
): Promise<Review[]> => {
  const response = await apiClient.get<{ reviews: Review[] }>(`/books/${bookId}/reviews`, {
    params: filters,
  });
  return response.data.reviews;
};

export const createReview = async (
  bookId: string,
  reviewData: ReviewFormData
): Promise<Review> => {
  const response = await apiClient.post<{ message: string; review: Review }>(
    `/books/${bookId}/reviews`,
    reviewData
  );
  return response.data.review;
};

export const updateReview = async (
  reviewId: string,
  reviewData: Partial<ReviewFormData>
): Promise<Review> => {
  const response = await apiClient.put<{ message: string; review: Review }>(
    `/reviews/${reviewId}`,
    reviewData
  );
  return response.data.review;
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  await apiClient.delete(`/reviews/${reviewId}`);
};