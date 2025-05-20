import express from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';
import { validate, userSchemas } from '../middlewares/validation';

const router = express.Router();
const authController = new AuthController();

// Register a new user
router.post(
  '/signup',
  validate(userSchemas.register),
  authController.register
);

// Login
router.post(
  '/login',
  validate(userSchemas.login),
  authController.login
);

// Get user profile (protected route)
router.get(
  '/profile',
  authenticate,
  authController.getProfile
);

export default router;