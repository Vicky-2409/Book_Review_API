// src/utils/token.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import { IUserResponse } from '../interfaces/IUser';

export const generateToken = (user: IUserResponse): string => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  const secret: jwt.Secret = process.env.JWT_SECRET || 'my-secret-key';
  const expiresIn: string = process.env.JWT_EXPIRES_IN || '7d';

const options: SignOptions = {
  expiresIn: expiresIn as SignOptions['expiresIn'],
};
  return jwt.sign(payload, secret, options);
};


export const verifyToken = (token: string): any => {
  const secret = process.env.JWT_SECRET || 'my-secret-key';
  return jwt.verify(token, secret);
};