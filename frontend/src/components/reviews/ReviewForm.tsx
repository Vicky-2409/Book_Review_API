import React, { useState } from 'react';
import type { ReviewFormData } from '../../types/review';
import Button from '../common/Button';
import TextArea from '../common/TextArea';
import Rating from '../common/Rating';
import Alert from '../common/Alert';

interface ReviewFormProps {
  onSubmit: (reviewData: ReviewFormData) => Promise<void>;
  initialData?: ReviewFormData;
  isEdit?: boolean;
  onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  initialData = { rating: 0, comment: '' },
  isEdit = false,
  onCancel,
}) => {
  const [reviewData, setReviewData] = useState<ReviewFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRatingChange = (value: number) => {
    setReviewData((prev) => ({ ...prev, rating: value }));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewData((prev) => ({ ...prev, comment: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (reviewData.rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (!reviewData.comment.trim()) {
      setError('Please enter a comment');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit(reviewData);
      if (!isEdit) {
        setReviewData({ rating: 0, comment: '' });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">
        {isEdit ? 'Edit Your Review' : 'Write a Review'}
      </h3>
      
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Your Rating</label>
          <Rating
            value={reviewData.rating}
            editable
            size="lg"
            onChange={handleRatingChange}
          />
        </div>
        
        <TextArea
          label="Your Review"
          placeholder="Share your thoughts about this book..."
          value={reviewData.comment}
          onChange={handleCommentChange}
          rows={5}
          fullWidth
        />
        
        <div className="flex justify-end gap-2 mt-4">
          {isEdit && onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEdit ? 'Update Review' : 'Post Review'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;