import React from 'react';
import type { Review, ReviewFilters } from '../../types/review';
import ReviewItem from './ReviewItem';
import Select from '../common/Select';

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
  filters: ReviewFilters;
  onFilterChange: (filters: ReviewFilters) => void;
  onUpdate: (reviewId: string, updatedData: { rating: number; comment: string }) => Promise<void>;
  onDelete: (reviewId: string) => Promise<void>;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  isLoading = false,
  filters,
  onFilterChange,
  onUpdate,
  onDelete,
}) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    onFilterChange({
      ...filters,
      sortBy: sortBy as 'rating' | 'createdAt',
      sortOrder: sortOrder as 'asc' | 'desc',
    });
  };

  const currentSortValue = filters.sortBy && filters.sortOrder
    ? `${filters.sortBy}-${filters.sortOrder}`
    : 'createdAt-desc';

  if (isLoading) {
    return (
      <div>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="border-b border-gray-200 pb-6 mb-6 animate-pulse">
            <div className="flex items-start">
              <div className="mr-3">
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Reviews</h3>
        <div className="w-48">
          <Select
            value={currentSortValue}
            onChange={handleSortChange}
            options={[
              { value: 'createdAt-desc', label: 'Newest First' },
              { value: 'createdAt-asc', label: 'Oldest First' },
              { value: 'rating-desc', label: 'Highest Rating' },
              { value: 'rating-asc', label: 'Lowest Rating' },
            ]}
          />
        </div>
      </div>

      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ReviewList;