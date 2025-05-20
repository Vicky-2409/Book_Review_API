// src/pages/books/BookList.tsx
import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import BookFilters from "../../components/books/BookFilters";
import Pagination from "../../components/common/Pagination";
import Alert from "../../components/common/Alert";
import { useBooks } from "../../hooks/useBooks";
import { Link } from "react-router-dom";

const BookListPage: React.FC = () => {
  const [genres, setGenres] = useState<{ value: string; label: string }[]>([]);
  const {
    books,
    totalPages,
    currentPage,
    isLoading,
    error,
    filters,
    updateFilters,
    handlePageChange,
    searchBooks,
  } = useBooks({ limit: 12 });

  // Fetch genres - would typically come from an API endpoint
  useEffect(() => {
    const commonGenres = [
      "Fiction",
      "Non-Fiction",
      "Science Fiction",
      "Fantasy",
      "Mystery",
      "Thriller",
      "Romance",
      "Biography",
      "History",
      "Self-Help",
      "Business",
      "Technology",
    ].sort();

    setGenres(
      commonGenres.map((genre) => ({
        value: genre,
        label: genre,
      }))
    );
  }, []);

  // Render book cards with skeleton loaders during loading state
  const renderBooks = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-xl mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="flex mt-3 space-x-2">
                <div className="h-7 bg-gray-200 rounded-full w-16"></div>
                <div className="h-7 bg-gray-200 rounded-full w-16"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (books.length === 0) {
      return (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <div className="mx-auto w-20 h-20 flex items-center justify-center bg-blue-50 rounded-full mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No Books Found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            We couldn't find any books matching your criteria. Try adjusting
            your filters or search terms.
          </p>
          <button
            onClick={() => updateFilters({})}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear All Filters
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {books.map((book) => (
          <Link
            to={`/books/${book.id}`}
            key={book.id}
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="relative overflow-hidden h-64">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={`${book.title} cover`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-blue-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              )}
              {book.averageRating > 0 && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-xs font-medium text-gray-800">
                    {book.averageRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-medium text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {book.title}
              </h3>
              <p className="text-gray-500 text-sm mb-3">by {book.author}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                {book.genre.slice(0, 2).map((genre, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {genre}
                  </span>
                ))}
                {book.genre.length > 2 && (
                  <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-full">
                    +{book.genre.length - 2}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  {book.reviewCount}{" "}
                  {book.reviewCount === 1 ? "review" : "reviews"}
                </div>
                <span className="text-blue-600 text-sm font-medium inline-flex items-center group-hover:underline">
                  View details
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Discover Your Next Favorite Book
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our collection of books, read reviews, and share your own
              thoughts with our community of book lovers.
            </p>
          </div>

          {/* Alert for errors */}
          {error && <Alert type="error" message={error} className="mb-8" />}

          {/* Filters */}
          <BookFilters
            initialFilters={filters}
            onFilterChange={updateFilters}
            onSearch={searchBooks}
            genres={genres}
          />

          {/* Books Results Section */}
          <div className="mt-8 mb-12">
            {books.length > 0 && !isLoading && (
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {filters.search
                    ? `Search results for "${filters.search}"`
                    : "All Books"}
                </h2>
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium">{books.length}</span> of{" "}
                  <span className="font-medium">{totalPages * 12}</span> books
                </p>
              </div>
            )}

            {renderBooks()}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </Layout>
  );
};

export default BookListPage;
