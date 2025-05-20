import { useState, useEffect, useCallback } from "react";
import type { Book, BookFilters } from "../types/book";
import * as bookApi from "../api/books";

export const useBooks = (initialFilters: BookFilters = {}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialFilters.page || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookFilters>(initialFilters);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookApi.getBooks({
        ...filters,
        page: currentPage,
      });
      setBooks(response.data);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
      setCurrentPage(response.currentPage);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch books");
      console.error("Error fetching books:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const updateFilters = (newFilters: BookFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const searchBooks = async (query: string) => {
    if (!query.trim()) {
      updateFilters({ search: undefined });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const results = await bookApi.searchBooks(query);
      setBooks(results);
      setTotalCount(results.length);
      setTotalPages(1);
      setCurrentPage(1);
    } catch (err: any) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    books,
    totalPages,
    totalCount,
    currentPage,
    isLoading,
    error,
    filters,
    updateFilters,
    handlePageChange,
    searchBooks,
    refreshBooks: fetchBooks,
  };
};
