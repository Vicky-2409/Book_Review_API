import { useState, useEffect, useCallback } from 'react';
import type { Review, ReviewFilters, ReviewFormData } from '../types/review';
import * as reviewApi from '../api/reviews';
import { useAuth } from '../context/AuthContext';

export const useReviews = (bookId: string, initialFilters: ReviewFilters = {}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReviewFilters>(initialFilters);
  const { user } = useAuth();

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await reviewApi.getReviewsByBookId(bookId, filters);
      setReviews(response);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch reviews');
      console.error('Error fetching reviews:', err);
    } finally {
      setIsLoading(false);
    }
  }, [bookId, filters]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const addReview = async (reviewData: ReviewFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newReview = await reviewApi.createReview(bookId, reviewData);
      setReviews(prev => [newReview, ...prev]);
      return newReview;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add review');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateReview = async (reviewId: string, reviewData: Partial<ReviewFormData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedReview = await reviewApi.updateReview(reviewId, reviewData);
      setReviews(prev =>
        prev.map(review => (review.id === reviewId ? updatedReview : review))
      );
      return updatedReview;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update review');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await reviewApi.deleteReview(reviewId);
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete review');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilters = (newFilters: ReviewFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getUserReview = useCallback(() => {
    if (!user) return null;
    return reviews.find(review => review.user.id === user.id) || null;
  }, [reviews, user]);

  return {
    reviews,
    isLoading,
    error,
    filters,
    updateFilters,
    addReview,
    updateReview,
    deleteReview,
    refreshReviews: fetchReviews,
    getUserReview,
  };
};