// src/repositories/UserRepository.ts
import { IUser, IUserResponse } from '../interfaces/IUser';
import { IUserRepository } from './interfaces/IUserRepository';
import User, { UserDocument } from '../models/User';
import mongoose from 'mongoose';

export class UserRepository implements IUserRepository {
  private mapUserToResponse(user: UserDocument): IUserResponse {
    return {
      id: user._id instanceof mongoose.Types.ObjectId 
          ? user._id.toString() 
          : String(user._id), // Handle different ID types safely
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin ?? false,
    };
  }

  async create(user: IUser): Promise<IUserResponse> {
    const newUser = new User(user);
    await newUser.save();
    return this.mapUserToResponse(newUser);
  }

  async findById(id: string): Promise<IUserResponse | null> {
    const user = await User.findById(id);
    return user ? this.mapUserToResponse(user) : null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return User.findOne({ username });
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUserResponse | null> {
    const user = await User.findByIdAndUpdate(id, userData, { new: true });
    return user ? this.mapUserToResponse(user) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}