// src/models/Book.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IBook } from '../interfaces/IBook';
import { UserDocument } from './User';

export interface BookDocument extends Omit<IBook, 'id' | 'addedBy'>, Document {
  _id: mongoose.Types.ObjectId;
  addedBy: mongoose.Types.ObjectId | UserDocument;
}

const BookSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    isbn: {
      type: String,
      trim: true,
    },
    publicationYear: {
      type: Number,
    },
    publisher: {
      type: String,
      trim: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search
BookSchema.index({ title: 'text', author: 'text' });

export default mongoose.model<BookDocument>('Book', BookSchema);