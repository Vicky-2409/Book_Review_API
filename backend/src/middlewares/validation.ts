// src/middlewares/validation.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      res.status(400).json({ 
        message: 'Validation error', 
        details: error.details.map(detail => detail.message) 
      });
      return;
    }
    
    next();
  };
};

// Common validation schemas
export const userSchemas = {
  register: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const bookSchemas = {
  create: Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    description: Joi.string().required(),
    genre: Joi.array().items(Joi.string()).min(1).required(),
    coverImage: Joi.string().uri().allow(''),
    isbn: Joi.string(),
    publicationYear: Joi.number().integer().min(1000).max(new Date().getFullYear()),
    publisher: Joi.string(),
  }),
  
  update: Joi.object({
    title: Joi.string(),
    author: Joi.string(),
    description: Joi.string(),
    genre: Joi.array().items(Joi.string()).min(1),
    coverImage: Joi.string().uri().allow(''),
    isbn: Joi.string(),
    publicationYear: Joi.number().integer().min(1000).max(new Date().getFullYear()),
    publisher: Joi.string(),
  }),
};

export const reviewSchemas = {
  create: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().required(),
  }),
  
  update: Joi.object({
    rating: Joi.number().integer().min(1).max(5),
    comment: Joi.string(),
  }),
};