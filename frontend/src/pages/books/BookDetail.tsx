// src/pages/books/BookDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Button from "../../components/common/Button";
import Rating from "../../components/common/Rating";
import ReviewForm from "../../components/reviews/ReviewForm";
import ReviewList from "../../components/reviews/ReviewList";
import Alert from "../../components/common/Alert";
import { useAuth } from "../../context/AuthContext";
import { useReviews } from "../../hooks/useReviews";
import * as bookApi from "../../api/books";
import type { Book } from "../../types/book";

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");

  const {
    reviews,
    filters: reviewFilters,
    updateFilters: updateReviewFilters,
    addReview,
    updateReview,
    deleteReview,
    isLoading: reviewsLoading,
    getUserReview,
  } = useReviews(id || "");

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;

      try {
        const data = await bookApi.getBookById(id);
        setBook(data);
        // Set the page title for SEO
        document.title = `${data.title} by ${data.author} | BookReview`;
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load book details");
        console.error("Error fetching book:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();

    // Clean up title on unmount
    return () => {
      document.title = "BookReview";
    };
  }, [id]);

  const handleEditBook = () => {
    if (id) {
      navigate(`/edit-book/${id}`);
    }
  };

  const handleDeleteBook = async () => {
    if (!id || !book) return;

    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookApi.deleteBook(id);
        navigate("/");
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete book");
      }
    }
  };

  const userReview = getUserReview();
  const canAddReview = isAuthenticated && !userReview;
  const canEditBook =
    isAuthenticated &&
    user &&
    book &&
    (user.id === book.addedBy.id || user.isAdmin);

  if (isLoading) {
    return (
      <Layout>
        <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              {/* Breadcrumb Skeleton */}
              <div className="flex items-center text-sm text-gray-400 mb-6">
                <div className="h-3 bg-gray-200 rounded w-12"></div>
                <div className="mx-2">/</div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Cover Image Skeleton */}
                  <div className="w-full lg:w-1/3">
                    <div className="bg-gray-200 h-96 rounded-xl"></div>
                  </div>

                  {/* Book Details Skeleton */}
                  <div className="w-full lg:w-2/3">
                    <div className="h-8 bg-gray-200 rounded-full w-3/4 mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-1/2 mb-6"></div>

                    <div className="flex items-center mb-6">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full bg-gray-200"
                          ></div>
                        ))}
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full w-24 ml-2"></div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="h-4 bg-gray-200 rounded-full w-1/4"></div>
                      <div className="flex space-x-2">
                        <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                        <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-8">
                      <div className="h-4 bg-gray-200 rounded-full w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                      <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                      <div className="h-4 bg-gray-200 rounded-full w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !book) {
    return (
      <Layout>
        <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Alert type="error" message={error || "Book not found"} />
            <div className="mt-4">
              <Button
                onClick={() => navigate("/")}
                leftIcon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              >
                Back to Books
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <button
              onClick={() => navigate("/")}
              className="hover:text-blue-600 transition-colors"
            >
              Books
            </button>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 font-medium truncate">
              {book.title}
            </span>
          </div>

          {/* Main Book Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - Book Cover */}
                <div className="w-full lg:w-1/3">
                  <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={`${book.title} cover`}
                        className="w-full h-auto object-cover"
                      />
                    ) : (
                      <div className="aspect-[2/3] bg-gradient-to-b from-blue-50 to-gray-50 flex items-center justify-center text-gray-400">
                        <div className="text-center p-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mx-auto mb-4 text-blue-200"
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
                          <span className="block text-gray-500">
                            Cover not available
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Book Actions */}
                  <div className="mt-6 space-y-4">
                    {/* Rating Card */}
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="flex justify-center mb-1">
                        <Rating value={book.averageRating} size="lg" />
                      </div>
                      <p className="text-blue-800 font-medium text-lg">
                        {book.averageRating.toFixed(1)}/5
                      </p>
                      <p className="text-blue-600 text-sm">
                        Based on {book.reviewCount}{" "}
                        {book.reviewCount === 1 ? "review" : "reviews"}
                      </p>
                    </div>

                    {/* Admin Actions */}
                    {canEditBook && (
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <h3 className="font-medium text-gray-700 mb-3 text-sm uppercase tracking-wide">
                          Book Management
                        </h3>
                        <Button
                          variant="outline"
                          onClick={handleEditBook}
                          fullWidth
                          className="justify-center"
                          leftIcon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          }
                        >
                          Edit Book
                        </Button>
                        <Button
                          variant="danger"
                          onClick={handleDeleteBook}
                          fullWidth
                          className="justify-center"
                          leftIcon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Book Details */}
                <div className="w-full lg:w-2/3">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {book.title}
                  </h1>
                  <p className="text-xl text-gray-600 mb-6">
                    by{" "}
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {book.author}
                    </span>
                  </p>

                  {/* Genre Tags */}
                  {book.genre && book.genre.length > 0 && (
                    <div className="mb-6">
                      <p className="text-gray-500 text-sm mb-2">Genre</p>
                      <div className="flex flex-wrap gap-2">
                        {book.genre.map((genre, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details Table */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-8">
                    <table className="w-full text-sm">
                      <tbody>
                        {book.isbn && (
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-gray-500 font-medium">
                              ISBN
                            </td>
                            <td className="py-3 text-gray-800">{book.isbn}</td>
                          </tr>
                        )}
                        {book.publicationYear && (
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-gray-500 font-medium">
                              Publication Year
                            </td>
                            <td className="py-3 text-gray-800">
                              {book.publicationYear}
                            </td>
                          </tr>
                        )}
                        {book.publisher && (
                          <tr className="border-b border-gray-200">
                            <td className="py-3 text-gray-500 font-medium">
                              Publisher
                            </td>
                            <td className="py-3 text-gray-800">
                              {book.publisher}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td className="py-3 text-gray-500 font-medium">
                            Added by
                          </td>
                          <td className="py-3 text-gray-800">
                            {book.addedBy.username}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Tab Navigation */}
                  <div className="border-b border-gray-200 mb-6">
                    <div className="flex space-x-8">
                      <button
                        onClick={() => setActiveTab("details")}
                        className={`pb-4 px-1 relative ${
                          activeTab === "details"
                            ? "text-blue-600 font-medium"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Description
                        {activeTab === "details" && (
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                        )}
                      </button>
                      <button
                        onClick={() => setActiveTab("reviews")}
                        className={`pb-4 px-1 relative flex items-center ${
                          activeTab === "reviews"
                            ? "text-blue-600 font-medium"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Reviews
                        <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                          {book.reviewCount}
                        </span>
                        {activeTab === "reviews" && (
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Tab Content */}
                  {activeTab === "details" ? (
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line leading-7">
                        {book.description}
                      </p>
                    </div>
                  ) : (
                    <div>
                      {/* Review Form */}
                      {canAddReview && (
                        <div className="mb-8 bg-blue-50 rounded-xl p-6">
                          <h3 className="text-lg font-medium text-gray-800 mb-4">
                            Share Your Thoughts
                          </h3>
                          <ReviewForm
                            onSubmit={async (data) => {
                              await addReview(data);
                            }}
                          />
                        </div>
                      )}

                      {/* Review List */}
                      <ReviewList
                        reviews={reviews}
                        isLoading={reviewsLoading}
                        filters={reviewFilters}
                        onFilterChange={updateReviewFilters}
                        onUpdate={async (reviewId, updatedData) => {
                          await updateReview(reviewId, updatedData);
                        }}
                        onDelete={deleteReview}
                      />

                      {/* No Reviews State */}
                      {!reviewsLoading && reviews.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 mx-auto text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                          </svg>
                          <h3 className="text-lg font-medium text-gray-800 mb-2">
                            No Reviews Yet
                          </h3>
                          <p className="text-gray-500 max-w-md mx-auto">
                            Be the first to share your thoughts on this book
                            with the community.
                          </p>
                          {!isAuthenticated && (
                            <div className="mt-6">
                              <Button
                                onClick={() => navigate("/login")}
                                variant="primary"
                              >
                                Login to Add a Review
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetail;
