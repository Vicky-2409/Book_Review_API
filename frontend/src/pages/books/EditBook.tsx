import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input';
import TextArea from '../../components/common/TextArea';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { useAuth } from '../../context/AuthContext';
import * as bookApi from '../../api/books';
import type { BookFormData, Book } from '../../types/book';

const EditBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    description: '',
    genre: [],
    coverImage: '',
    isbn: '',
    publicationYear: undefined,
    publisher: '',
  });
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genreInput, setGenreInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBook = async () => {
      if (!id) return;

      try {
        const bookData = await bookApi.getBookById(id);
        setBook(bookData);
        
        setFormData({
          title: bookData.title,
          author: bookData.author,
          description: bookData.description,
          genre: bookData.genre,
          coverImage: bookData.coverImage || '',
          isbn: bookData.isbn || '',
          publicationYear: bookData.publicationYear,
          publisher: bookData.publisher || '',
        });
        
        setSelectedGenres(bookData.genre);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load book data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id, isAuthenticated, navigate]);

  useEffect(() => {
    // Check if user is allowed to edit this book
    if (book && user && !isLoading) {
      if (book.addedBy.id !== user.id && !user.isAdmin) {
        navigate(`/books/${id}`);
      }
    }
  }, [book, user, isLoading, navigate, id]);

  // Rest of the component with handleInputChange, handleGenreSelect, 
  // handleRemoveGenre, handleAddCustomGenre, filteredGenres, and handleSubmit
  // (These functions will be similar to AddBook component but with updateBook API call)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'publicationYear' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleGenreSelect = (genre: string) => {
    if (!selectedGenres.includes(genre)) {
      const updatedGenres = [...selectedGenres, genre];
      setSelectedGenres(updatedGenres);
      setFormData((prev) => ({ ...prev, genre: updatedGenres }));
    }
    setGenreInput('');
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

  const genreOptions = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery',
    'Thriller', 'Romance', 'Biography', 'History', 'Self-Help',
    'Business', 'Technology', 'Poetry', 'Children', 'Young Adult'
  ].sort();

  const filteredGenres = genreInput
    ? genreOptions.filter((genre) =>
        genre.toLowerCase().includes(genreInput.toLowerCase()) &&
        !selectedGenres.includes(genre)
      )
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    if (!formData.title.trim() || !formData.author.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.genre.length === 0) {
      setError('Please select at least one genre');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const updatedBook = await bookApi.updateBook(id, formData);
      navigate(`/books/${updatedBook.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update book');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Edit Book</h1>
          
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
              className="mb-6"
            />
          )}
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              {/* Form fields - same as AddBook component */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Title *"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter book title"
                    fullWidth
                    required
                  />
                </div>
                
                {/* Other form fields... */}
                <div className="md:col-span-2">
                  <Input
                    label="Author *"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Enter author name"
                    fullWidth
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <TextArea
                    label="Description *"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter book description"
                    rows={5}
                    fullWidth
                    required
                  />
                </div>
                
                {/* Genre selection UI */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-1">
                    Genres *
                  </label>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {selectedGenres.map((genre) => (
                      <div
                        key={genre}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {genre}
                        <button
                          type="button"
                          onClick={() => handleRemoveGenre(genre)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <div className="flex">
                      <Input
                        value={genreInput}
                        onChange={(e) => setGenreInput(e.target.value)}
                        placeholder="Search or add genres"
                        fullWidth
                        className="rounded-r-none"
                      />
                      <Button
                        type="button"
                        onClick={handleAddCustomGenre}
                        disabled={!genreInput.trim()}
                        className="rounded-l-none"
                      >
                        Add
                      </Button>
                    </div>
                    
                    {filteredGenres.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredGenres.map((genre) => (
                          <button
                            key={genre}
                            type="button"
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={() => handleGenreSelect(genre)}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Other input fields like ISBN, year, etc. */}
                <div>
                  <Input
                    label="ISBN"
                    name="isbn"
                    value={formData.isbn || ''}
                    onChange={handleInputChange}
                    placeholder="Enter ISBN (optional)"
                    fullWidth
                  />
                </div>
                
                <div>
                  <Input
                    label="Publication Year"
                    name="publicationYear"
                    type="number"
                    value={formData.publicationYear || ''}
                    onChange={handleInputChange}
                    placeholder="Enter year (optional)"
                    fullWidth
                    min={1000}
                    max={new Date().getFullYear()}
                  />
                </div>
                
                <div>
                  <Input
                    label="Publisher"
                    name="publisher"
                    value={formData.publisher || ''}
                    onChange={handleInputChange}
                    placeholder="Enter publisher (optional)"
                    fullWidth
                  />
                </div>
                
                <div>
                  <Input
                    label="Cover Image URL"
                    name="coverImage"
                    value={formData.coverImage || ''}
                    onChange={handleInputChange}
                    placeholder="Enter image URL (optional)"
                    fullWidth
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(`/books/${id}`)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Update Book
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditBook;