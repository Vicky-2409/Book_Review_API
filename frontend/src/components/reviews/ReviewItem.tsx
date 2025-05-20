import React, { useState } from 'react';
import type { Review } from '../../types/review';
import { useAuth } from '../../context/AuthContext';
import Rating from '../common/Rating';
import Button from '../common/Button';
import ReviewForm from './ReviewForm';
import { formatDate } from '../../utils/formatters';

interface ReviewItemProps {
  review: Review;
  onUpdate: (reviewId: string, updatedData: { rating: number; comment: string }) => Promise<void>;
  onDelete: (reviewId: string) => Promise<void>;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = user && user.id === review.user.id;
  
  const handleUpdate = async (reviewData: { rating: number; comment: string }) => {
    await onUpdate(review.id, reviewData);
    setIsEditing(false);
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setIsDeleting(true);
      try {
        await onDelete(review.id);
      } catch (error) {
        console.error('Failed to delete review:', error);
        setIsDeleting(false);
      }
    }
  };
  
  if (isEditing) {
    return (
      <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0">
        <ReviewForm
          initialData={{ rating: review.rating, comment: review.comment }}
          onSubmit={handleUpdate}
          isEdit
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }
  
  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="mr-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
              {review.user.username.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800">{review.user.username}</h4>
            <div className="flex items-center mt-1">
              <Rating value={review.rating} size="sm" />
              <span className="text-gray-500 text-sm ml-2">
                {formatDate(new Date(review.createdAt || ''))}
              </span>
            </div>
          </div>
        </div>
        
        {isOwner && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              isLoading={isDeleting}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
      
      <div className="mt-3 text-gray-700 whitespace-pre-line">{review.comment}</div>
    </div>
  );
};

export default ReviewItem;