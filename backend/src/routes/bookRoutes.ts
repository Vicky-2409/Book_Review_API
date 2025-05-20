import express from 'express';
import { BookController } from '../controllers/bookController';
import { authenticate, authorizeAdmin } from '../middlewares/auth';
import { validate, bookSchemas } from '../middlewares/validation';

const router = express.Router();
const bookController = new BookController();

// Get all books (public)
router.get('/', bookController.getAllBooks);

// Search books (public)
router.get('/search', bookController.searchBooks);

// Get book by ID (public)
router.get('/:id', bookController.getBookById);

// Add new book (protected)
router.post(
  '/',
  authenticate,
  validate(bookSchemas.create),
  bookController.createBook
);

// Update book (protected)
router.put(
  '/:id',
  authenticate,
  validate(bookSchemas.update),
  bookController.updateBook
);

// Delete book (protected)
router.delete(
  '/:id',
  authenticate,
  bookController.deleteBook
);

export default router;