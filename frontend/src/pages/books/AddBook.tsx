// src/pages/books/AddBook.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import Input from "../../components/common/Input";
import TextArea from "../../components/common/TextArea";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import { useAuth } from "../../context/AuthContext";
import * as bookApi from "../../api/books";
import type { BookFormData } from "../../types/book";

const genreOptions = [
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
  "Poetry",
  "Children",
  "Young Adult",
  "Horror",
  "Adventure",
  "Crime",
  "Drama",
  "Humor",
].sort();

const AddBook: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    description: "",
    genre: [],
    coverImage: "",
    isbn: "",
    publicationYear: undefined,
    publisher: "",
  });
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genreInput, setGenreInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "publicationYear"
          ? value
            ? parseInt(value)
            : undefined
          : value,
    }));
  };

  const handleGenreSelect = (genre: string) => {
    if (!selectedGenres.includes(genre)) {
      const updatedGenres = [...selectedGenres, genre];
      setSelectedGenres(updatedGenres);
      setFormData((prev) => ({ ...prev, genre: updatedGenres }));
    }
    setGenreInput("");
  };

  const handleRemoveGenre = (genre: string) => {
    const updatedGenres = selectedGenres.filter((g) => g !== genre);
    setSelectedGenres(updatedGenres);
    setFormData((prev) => ({ ...prev, genre: updatedGenres }));
  };

  const handleAddCustomGenre = () => {
    if (genreInput.trim() && !selectedGenres.includes(genreInput.trim())) {
      handleGenreSelect(genreInput.trim());
    }
  };

  const filteredGenres = genreInput
    ? genreOptions.filter(
        (genre) =>
          genre.toLowerCase().includes(genreInput.toLowerCase()) &&
          !selectedGenres.includes(genre)
      )
    : [];

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.title.trim() || !formData.author.trim()) {
          setError("Please provide both title and author");
          return false;
        }
        break;
      case 2:
        if (!formData.description.trim()) {
          setError("Please provide a description");
          return false;
        }
        if (formData.genre.length === 0) {
          setError("Please select at least one genre");
          return false;
        }
        break;
    }
    setError(null);
    return true;
  };

  const goToNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const book = await bookApi.createBook(formData);
      navigate(`/books/${book.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add book");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        {[...Array(totalSteps)].map((_, index) => (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div
              className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                index + 1 === currentStep
                  ? "border-blue-600 bg-blue-50 text-blue-600 font-semibold"
                  : index + 1 < currentStep
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {index + 1 < currentStep ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                index + 1
              )}

              {/* Step label */}
              <span className="absolute -bottom-6 text-xs font-medium w-max left-1/2 transform -translate-x-1/2 text-gray-500">
                {index === 0
                  ? "Basic Info"
                  : index === 1
                  ? "Details"
                  : "Additional Info"}
              </span>
            </div>

            {/* Connector line */}
            {index < totalSteps - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  index + 1 < currentStep ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="space-y-6">
              <div>
                <Input
                  label="Title *"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter the book's title"
                  fullWidth
                  required
                  className="px-4 py-3 text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <Input
                  label="Author *"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="Enter the author's name"
                  fullWidth
                  required
                  className="px-4 py-3 text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="space-y-6">
              <div>
                <TextArea
                  label="Description *"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter a detailed description of the book"
                  rows={5}
                  fullWidth
                  required
                  className="px-4 py-3 text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Genres *
                </label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {selectedGenres.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      No genres selected yet
                    </p>
                  ) : (
                    selectedGenres.map((genre) => (
                      <div
                        key={genre}
                        className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center transition-all hover:bg-blue-100"
                      >
                        {genre}
                        <button
                          type="button"
                          onClick={() => handleRemoveGenre(genre)}
                          className="ml-1.5 text-blue-500 hover:text-blue-700 focus:outline-none"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="relative">
                  <div className="flex">
                    <Input
                      value={genreInput}
                      onChange={(e) => setGenreInput(e.target.value)}
                      placeholder="Search genres or type a new one"
                      fullWidth
                      className="px-4 py-3 text-base rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Button
                      type="button"
                      onClick={handleAddCustomGenre}
                      disabled={!genreInput.trim()}
                      className="rounded-l-none bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium px-6 py-2 text-sm flex items-center h-[46px] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Add
                    </Button>
                  </div>

                  {filteredGenres.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                      {filteredGenres.map((genre) => (
                        <button
                          key={genre}
                          type="button"
                          className="block w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700 transition-colors"
                          onClick={() => handleGenreSelect(genre)}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="ISBN"
                  name="isbn"
                  value={formData.isbn || ""}
                  onChange={handleInputChange}
                  placeholder="Enter ISBN number"
                  fullWidth
                  className="px-4 py-3 text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <Input
                  label="Publication Year"
                  name="publicationYear"
                  type="number"
                  value={formData.publicationYear || ""}
                  onChange={handleInputChange}
                  placeholder="e.g. 2023"
                  fullWidth
                  min={1000}
                  max={new Date().getFullYear()}
                  className="px-4 py-3 text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <Input
                  label="Publisher"
                  name="publisher"
                  value={formData.publisher || ""}
                  onChange={handleInputChange}
                  placeholder="Enter publisher name"
                  fullWidth
                  className="px-4 py-3 text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <Input
                  label="Cover Image URL"
                  name="coverImage"
                  value={formData.coverImage || ""}
                  onChange={handleInputChange}
                  placeholder="https://example.com/book-cover.jpg"
                  fullWidth
                  className="px-4 py-3 text-base rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <h3 className="font-medium text-blue-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Preview
              </h3>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="text-sm">
                  <p className="text-gray-500">Title:</p>
                  <p className="font-medium text-gray-800">
                    {formData.title || "-"}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Author:</p>
                  <p className="font-medium text-gray-800">
                    {formData.author || "-"}
                  </p>
                </div>
                <div className="sm:col-span-2 text-sm">
                  <p className="text-gray-500">Genres:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.genre.length > 0 ? (
                      formData.genre.map((g) => (
                        <span
                          key={g}
                          className="bg-white px-2 py-0.5 rounded text-xs text-gray-700"
                        >
                          {g}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <Layout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Add a New Book
            </h1>
            <p className="text-gray-600">
              Share your favorite book with the community
            </p>
          </div>

          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
              className="mb-8"
            />
          )}

          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
            {renderStepIndicator()}

            {currentStep === 3 ? (
              <form onSubmit={handleSubmit} className="mt-10">
                {renderStepContent()}

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevStep}
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
                    Previous
                  </Button>

                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    rightIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    }
                  >
                    Add Book
                  </Button>
                </div>
              </form>
            ) : (
              <div className="mt-10">
                {renderStepContent()}

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={goToPrevStep}
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
                      Previous
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/")}
                    >
                      Cancel
                    </Button>
                  )}

                  <Button
                    type="button"
                    onClick={goToNextStep}
                    rightIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    }
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Help section */}
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
            <h3 className="font-medium text-gray-800 mb-2">
              Tips for adding a book
            </h3>
            <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
              <li>
                Add a detailed description to help others understand what the
                book is about
              </li>
              <li>
                Select relevant genres to make your book easier to discover
              </li>
              <li>
                If available, include a cover image URL for better visibility
              </li>
              <li>
                Adding the publication year and publisher helps with book
                identification
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddBook;
