// src/models/Review.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IReview } from '../interfaces/IReview';
import { UserDocument } from './User';
import { BookDocument } from './Book';

export interface ReviewDocument extends Omit<IReview, 'id' | 'userId' | 'bookId'>, Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | UserDocument;
  bookId: mongoose.Types.ObjectId | BookDocument;
}

const ReviewSchema: Schema = new Schema(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only review a book once
ReviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

export default mongoose.model<ReviewDocument>('Review', ReviewSchema);