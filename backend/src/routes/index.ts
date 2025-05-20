import express from 'express';
import authRoutes from './authRoutes';
import bookRoutes from './bookRoutes';
import reviewRoutes from './reviewRoutes';
import authorRoutes from './authorRoutes';
const router = express.Router();

// API version prefix
const API_PREFIX = '/api/v1';

// Register routes
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/books`, bookRoutes);
router.use(`${API_PREFIX}`, reviewRoutes);
router.use(`${API_PREFIX}/authors`, authorRoutes);

export default router;