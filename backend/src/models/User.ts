// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interfaces/IUser';

// Use Omit to exclude the 'id' property from IUser
export interface UserDocument extends Omit<IUser, 'id'>, Document {
  // Explicitly add other fields if needed
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<UserDocument>('User', UserSchema);