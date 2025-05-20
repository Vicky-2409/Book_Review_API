import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);
  
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  
  // Handle MongoDB duplicate key error
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    res.status(409).json({ message: 'Duplicate entry found' });
    return;
  }
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({ message: err.message });
    return;
  }
  
  // Default server error
  res.status(500).json({ message: 'Internal server error' });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({ message: 'Resource not found' });
};