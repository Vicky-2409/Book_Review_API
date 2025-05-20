import apiClient from './client';
import type { Book, BookFilters, BookFormData, PaginatedBooks } from '../types/book';

export const getBooks = async (filters: BookFilters = {}): Promise<PaginatedBooks> => {
  const response = await apiClient.get<PaginatedBooks>('/books', { params: filters });
  return response.data;
};

export const getBookById = async (id: string): Promise<Book> => {
  const response = await apiClient.get<{ book: Book }>(`/books/${id}`);
  return response.data.book;
};

export const createBook = async (bookData: BookFormData): Promise<Book> => {
  const response = await apiClient.post<{ message: string; book: Book }>('/books', bookData);
  return response.data.book;
};

export const updateBook = async (id: string, bookData: Partial<BookFormData>): Promise<Book> => {
  const response = await apiClient.put<{ message: string; book: Book }>(`/books/${id}`, bookData);
  return response.data.book;
};

export const deleteBook = async (id: string): Promise<void> => {
  await apiClient.delete(`/books/${id}`);
};

export const searchBooks = async (query: string): Promise<Book[]> => {
  const response = await apiClient.get<{ results: Book[] }>('/books/search', {
    params: { query },
  });
  return response.data.results;
};