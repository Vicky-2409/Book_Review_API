// src/components/books/BookFilters.tsx
import React, { useState, useEffect } from "react";
import type { BookFilters as FiltersType } from "../../types/book";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import * as authorApi from "../../api/authors";

interface GenreOption {
  value: string;
  label: string;
}

interface AuthorOption {
  value: string;
  label: string;
}

interface BookFiltersProps {
  initialFilters: FiltersType;
  onFilterChange: (filters: FiltersType) => void;
  genres: GenreOption[];
  onSearch?: (query: string) => void;
}

const BookFilters: React.FC<BookFiltersProps> = ({
  initialFilters,
  onFilterChange,
  genres,
  onSearch,
}) => {
  const [filters, setFilters] = useState<FiltersType>(initialFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const [authors, setAuthors] = useState<AuthorOption[]>([]);
  const [isLoadingAuthors, setIsLoadingAuthors] = useState(false);
  const [authorError, setAuthorError] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Fetch authors from API when component mounts
  useEffect(() => {
    const fetchAuthors = async () => {
      setIsLoadingAuthors(true);
      setAuthorError(null);

      try {
        // Use the author service to fetch authors
        const authorsData = await authorApi.getAuthors();

        // Transform the data to match the option format
        const authorOptions = authorsData.map((author) => ({
          value: author.name,
          label: author.name,
        }));

        setAuthors(authorOptions);
      } catch (error) {
        console.error("Error fetching authors:", error);
        setAuthorError("Failed to load authors");

        // Fallback to some default authors if API fails
        setAuthors([
          { value: "J.K. Rowling", label: "J.K. Rowling" },
          { value: "George R.R. Martin", label: "George R.R. Martin" },
          { value: "Stephen King", label: "Stephen King" },
        ]);
      } finally {
        setIsLoadingAuthors(false);
      }
    };

    fetchAuthors();
  }, []);

  useEffect(() => {
    setFilters(initialFilters);
    setSearchQuery(initialFilters.search || "");
  }, [initialFilters]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      onFilterChange({ ...filters, search: searchQuery || undefined, page: 1 });
    }
  };

  const handleFilterChange = () => {
    onFilterChange({ ...filters, search: searchQuery || undefined, page: 1 });
    setIsFilterVisible(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      page: 1,
      limit: initialFilters.limit,
      search: undefined,
    };
    setFilters(clearedFilters);
    setSearchQuery("");
    onFilterChange(clearedFilters);
  };

  const sortOptions = [
    { value: "title-asc", label: "Title (A-Z)" },
    { value: "title-desc", label: "Title (Z-A)" },
    { value: "author-asc", label: "Author (A-Z)" },
    { value: "author-desc", label: "Author (Z-A)" },
    { value: "publicationYear-desc", label: "Newest First" },
    { value: "publicationYear-asc", label: "Oldest First" },
    { value: "averageRating-desc", label: "Highest Rated" },
    { value: "averageRating-asc", label: "Lowest Rated" },
  ];

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split("-");
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy as
        | "title"
        | "author"
        | "publicationYear"
        | "averageRating",
      sortOrder: sortOrder as "asc" | "desc",
    }));
  };

  const currentSortValue =
    filters.sortBy && filters.sortOrder
      ? `${filters.sortBy}-${filters.sortOrder}`
      : "title-asc";

  const toggleFilters = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  // Check if any filters are applied
  const hasActiveFilters =
    !!filters.genre || !!filters.author || currentSortValue !== "title-asc";

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300">
      {/* Search Bar - Always visible */}
      <div className="p-6 border-b border-gray-100">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="Search by title, author, or keyword..."
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            className="pl-12 pr-20 py-3 text-base rounded-full border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-100 transition-all"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Button
              type="submit"
              className="px-4 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Search
            </Button>
          </div>
        </form>

        {/* Filter Toggle Button - Mobile Only */}
        <div className="mt-4 md:hidden flex items-center justify-between">
          <button
            onClick={toggleFilters}
            className="flex items-center text-sm text-gray-600 font-medium hover:text-blue-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            {isFilterVisible ? "Hide Filters" : "Show Filters"}
          </button>

          {hasActiveFilters && (
            <span className="flex items-center text-sm text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Filters Applied
            </span>
          )}
        </div>
      </div>

      {/* Filter Controls - Desktop always visible, Mobile toggle */}
      <div
        className={`p-6 border-t border-gray-100 bg-gray-50 transition-all duration-300 ${
          isFilterVisible
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 md:max-h-[500px] md:opacity-100 hidden md:block overflow-hidden"
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-medium text-lg text-gray-800">Refine Results</h3>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Clear All Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Select
              label="Genre"
              name="genre"
              value={filters.genre || ""}
              onChange={handleInputChange}
              options={[{ value: "", label: "All Genres" }, ...genres]}
              fullWidth
              className="rounded-lg border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-100"
            />
          </div>

          <div>
            <Select
              label="Author"
              name="author"
              value={filters.author || ""}
              onChange={handleInputChange}
              options={[
                {
                  value: "",
                  label: isLoadingAuthors
                    ? "Loading authors..."
                    : "All Authors",
                },
                ...authors,
              ]}
              fullWidth
              disabled={isLoadingAuthors}
              error={authorError || undefined}
              className="rounded-lg border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-100"
            />
            {isLoadingAuthors && (
              <div className="mt-1 flex items-center text-sm text-blue-600">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading authors...
              </div>
            )}
          </div>

          <div>
            <Select
              label="Sort By"
              name="sort"
              value={currentSortValue}
              onChange={handleSortChange}
              options={sortOptions}
              fullWidth
              className="rounded-lg border-gray-200 focus:border-blue-400 focus:ring focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleFilterChange}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-colors shadow-sm"
          >
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Active Filters Display - Desktop only */}
      {hasActiveFilters && (
        <div className="hidden md:flex items-center px-6 py-3 bg-blue-50 text-blue-700 text-sm border-t border-blue-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <div className="flex items-center flex-wrap gap-2">
            <span className="font-medium">Active filters:</span>
            {filters.genre && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Genre: {filters.genre}
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, genre: "" }))}
                  className="ml-1 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}
            {filters.author && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Author: {filters.author}
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, author: "" }))
                  }
                  className="ml-1 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}
            {currentSortValue !== "title-asc" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Sorted by:{" "}
                {
                  sortOptions.find((opt) => opt.value === currentSortValue)
                    ?.label
                }
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      sortBy: "title",
                      sortOrder: "asc",
                    }))
                  }
                  className="ml-1 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-blue-700 hover:text-blue-900 hover:underline text-xs font-medium ml-2"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookFilters;
