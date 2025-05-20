import { IUser, IUserResponse } from '../interfaces/IUser';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { AppError } from '../middlewares/errorHandler';
import { hashPassword, comparePassword } from '../utils/hashing';
import { generateToken } from '../utils/token';

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async register(userData: IUser): Promise<IUserResponse> {
    // Check if user exists
    const existingEmail = await this.userRepository.findByEmail(userData.email);
    if (existingEmail) {
      throw new AppError('Email already in use', 409);
    }

    const existingUsername = await this.userRepository.findByUsername(userData.username);
    if (existingUsername) {
      throw new AppError('Username already in use', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);
    const userWithHashedPassword = {
      ...userData,
      password: hashedPassword,
    };

    // Create user
    return this.userRepository.create(userWithHashedPassword);
  }

  async login(email: string, password: string): Promise<{ user: IUserResponse; token: string }> {
    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate token
    const userResponse: IUserResponse = {
      id: user.id as string,
      username: user.username,
      email: user.email,
      isAdmin: !!user.isAdmin,
    };
    const token = generateToken(userResponse);

    return { user: userResponse, token };
  }
}