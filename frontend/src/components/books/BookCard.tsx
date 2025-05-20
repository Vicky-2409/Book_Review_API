import React from 'react';
import { Link } from 'react-router-dom';
import type { Book } from '../../types/book';
import Rating from '../common/Rating';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <Link to={`/books/${book.id}`}>
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={`${book.title} cover`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center justify-center w-full h-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span>No Cover</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/books/${book.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-blue-600 truncate">
            {book.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
        
        <div className="flex items-center mb-2">
          <Rating value={book.averageRating} size="sm" />
          <span className="text-gray-600 text-sm ml-2">
            ({book.reviewCount} {book.reviewCount === 1 ? 'review' : 'reviews'})
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {book.genre.slice(0, 3).map((genre, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              {genre}
            </span>
          ))}
          {book.genre.length > 3 && (
            <span className="text-gray-500 text-xs">+{book.genre.length - 3} more</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;