# BookReview - Full-Stack Book Review Application

A modern, full-stack application for book enthusiasts to share and discover book reviews. Built with a clean, modular architecture and best practices.

## 📋 Features

- **Authentication:** JWT-based user authentication and authorization
- **Book Management:** Add, view, edit, and delete books
- **Review System:** Post, edit, and delete reviews with ratings
- **Search & Filter:** Find books by title, author, or genre


## 🧱 Tech Stack


### 🛠️ Backend
- **Runtime:** Node.js
- **Framework:** Express.js with TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcrypt for hashing
- **Architecture:** Interface-driven with repository pattern
- **Environment Variables:** dotenv for configuration

## 🚀 Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- MongoDB (local or Atlas URI)

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bookreview.git
   cd bookreview
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Backend dependencies
   cd backend
   npm install



3. Set up environment variables:
   - Backend: Create a `.env` file in the `backend` directory (see `.env.example`)


4. Start MongoDB:
   - If using local MongoDB:
     ```bash
     mongod --dbpath=/path/to/data/db
     ```
   - Or use MongoDB Atlas (update your connection string in `.env`)

5. Run the application:
   - Development mode (with hot reloading):
     ```bash
     # Start backend (from backend directory)
     npm run dev
     ```

   - Production mode:
     ```bash
     # Build and start backend
     npm run build
     npm start
     ```

## 🗄️ Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/               # Configuration files
│   ├── controllers/          # Request handlers
│   ├── routes/               # API routes
│   ├── models/               # Mongoose schemas
│   ├── repositories/         # Repository pattern implementation
│   │   ├── interfaces/       # Repository interfaces
│   ├── interfaces/           # Domain interfaces
│   ├── services/             # Business logic
│   ├── middlewares/          # Middleware functions
│   ├── utils/                # Helper functions
│   └── index.ts              # Application entry point
├── .env                      # Environment variables
└── package.json              # Dependencies
```

```

## 🗃️ MongoDB Schema

### User Schema
```javascript
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  timestamps: true
}
```

### Book Schema
```javascript
{
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: [String], required: true },
  coverImage: { type: String, default: '' },
  isbn: { type: String },
  publicationYear: { type: Number },
  publisher: { type: String },
  addedBy: { type: ObjectId, ref: 'User', required: true },
  timestamps: true
}
```

### Review Schema
```javascript
{
  bookId: { type: ObjectId, ref: 'Book', required: true },
  userId: { type: ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  timestamps: true
}
```

## 📡 API Endpoints

### Authentication

#### Register a new user
```
POST /api/v1/auth/signup

Request:
{
  "username": "user1",
  "email": "user1@example.com",
  "password": "password123"
}

Response:
{
  "message": "User registered successfully",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "user1",
    "email": "user1@example.com",
    "isAdmin": false
  }
}
```

#### Login
```
POST /api/v1/auth/login

Request:
{
  "email": "user1@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "user1",
    "email": "user1@example.com",
    "isAdmin": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Books

#### Get all books (with pagination and filters)
```
GET /api/v1/books?page=1&limit=10&genre=Fiction&author=Author&sortBy=title&sortOrder=asc

Response:
{
  "data": [
    {
      "id": "60d21b4667d0d8992e610c86",
      "title": "Book Title",
      "author": "Author Name",
      "description": "Book description...",
      "genre": ["Fiction", "Mystery"],
      "coverImage": "https://example.com/cover.jpg",
      "isbn": "9781234567897",
      "publicationYear": 2023,
      "publisher": "Publisher Name",
      "averageRating": 4.5,
      "reviewCount": 10,
      "addedBy": {
        "id": "60d21b4667d0d8992e610c85",
        "username": "user1",
        "email": "user1@example.com",
        "isAdmin": false
      }
    }
    // More books...
  ],
  "totalCount": 100,
  "totalPages": 10,
  "currentPage": 1
}
```

#### Get book by ID
```
GET /api/v1/books/:id

Response:
{
  "book": {
    "id": "60d21b4667d0d8992e610c86",
    "title": "Book Title",
    "author": "Author Name",
    "description": "Book description...",
    "genre": ["Fiction", "Mystery"],
    "coverImage": "https://example.com/cover.jpg",
    "isbn": "9781234567897",
    "publicationYear": 2023,
    "publisher": "Publisher Name",
    "averageRating": 4.5,
    "reviewCount": 10,
    "addedBy": {
      "id": "60d21b4667d0d8992e610c85",
      "username": "user1",
      "email": "user1@example.com",
      "isAdmin": false
    }
  }
}
```

#### Add a new book (authenticated)
```
POST /api/v1/books

Headers:
Authorization: Bearer <token>

Request:
{
  "title": "New Book",
  "author": "Author Name",
  "description": "Book description...",
  "genre": ["Fiction", "Mystery"],
  "coverImage": "https://example.com/cover.jpg",
  "isbn": "9781234567897",
  "publicationYear": 2023,
  "publisher": "Publisher Name"
}

Response:
{
  "message": "Book created successfully",
  "book": {
    "id": "60d21b4667d0d8992e610c86",
    "title": "New Book",
    "author": "Author Name",
    "description": "Book description...",
    "genre": ["Fiction", "Mystery"],
    "coverImage": "https://example.com/cover.jpg",
    "isbn": "9781234567897",
    "publicationYear": 2023,
    "publisher": "Publisher Name",
    "averageRating": 0,
    "reviewCount": 0,
    "addedBy": {
      "id": "60d21b4667d0d8992e610c85",
      "username": "user1",
      "email": "user1@example.com",
      "isAdmin": false
    }
  }
}
```

#### Update a book (authenticated, owner only)
```
PUT /api/v1/books/:id

Headers:
Authorization: Bearer <token>

Request:
{
  "title": "Updated Book Title",
  "description": "Updated description..."
}

Response:
{
  "message": "Book updated successfully",
  "book": {
    // Updated book details
  }
}
```

#### Delete a book (authenticated, owner only)
```
DELETE /api/v1/books/:id

Headers:
Authorization: Bearer <token>

Response:
{
  "message": "Book deleted successfully"
}
```

#### Search books
```
GET /api/v1/books/search?query=mystery

Response:
{
  "results": [
    // Books matching the search query
  ]
}
```

### Reviews

#### Get reviews for a book
```
GET /api/v1/books/:id/reviews?page=1&limit=10&sortBy=rating&sortOrder=desc

Response:
{
  "reviews": [
    {
      "id": "60d21b4667d0d8992e610c87",
      "bookId": "60d21b4667d0d8992e610c86",
      "rating": 5,
      "comment": "Great book!",
      "user": {
        "id": "60d21b4667d0d8992e610c85",
        "username": "user1",
        "email": "user1@example.com",
        "isAdmin": false
      },
      "createdAt": "2023-11-15T10:30:00Z",
      "updatedAt": "2023-11-15T10:30:00Z"
    }
    // More reviews...
  ]
}
```

#### Add a review (authenticated, 1 review per user per book)
```
POST /api/v1/books/:id/reviews

Headers:
Authorization: Bearer <token>

Request:
{
  "rating": 5,
  "comment": "I really enjoyed this book!"
}

Response:
{
  "message": "Review created successfully",
  "review": {
    "id": "60d21b4667d0d8992e610c87",
    "bookId": "60d21b4667d0d8992e610c86",
    "rating": 5,
    "comment": "I really enjoyed this book!",
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "username": "user1",
      "email": "user1@example.com",
      "isAdmin": false
    },
    "createdAt": "2023-11-15T10:30:00Z",
    "updatedAt": "2023-11-15T10:30:00Z"
  }
}
```

#### Update a review (authenticated, owner only)
```
PUT /api/v1/reviews/:id

Headers:
Authorization: Bearer <token>

Request:
{
  "rating": 4,
  "comment": "Updated comment after second read."
}

Response:
{
  "message": "Review updated successfully",
  "review": {
    // Updated review details
  }
}
```

#### Delete a review (authenticated, owner only)
```
DELETE /api/v1/reviews/:id

Headers:
Authorization: Bearer <token>

Response:
{
  "message": "Review deleted successfully"
}
```

## 🔄 Design Patterns & Architecture

### Interface-Driven Architecture
The application follows an interface-driven approach, separating the interface definitions from their implementations:

```typescript
// Interface
export interface IBookRepository {
  create(book: IBook): Promise<IBookResponse>;
  findById(id: string): Promise<IBookResponse | null>;
  // Other methods...
}

// Implementation
export class BookRepository implements IBookRepository {
  async create(book: IBook): Promise<IBookResponse> {
    // Implementation details...
  }
  
  async findById(id: string): Promise<IBookResponse | null> {
    // Implementation details...
  }
  
  // Other methods...
}
```

This approach makes it easy to:
- Swap implementations (e.g., switching from MongoDB to another database)
- Test components in isolation with mock implementations
- Ensure consistent API contracts

### Repository Pattern
The repository pattern encapsulates database access logic:

```typescript
// Service using repository through interface
export class BookService {
  constructor(private bookRepository: IBookRepository) {}

  async getBookById(id: string): Promise<IBookResponse> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new AppError('Book not found', 404);
    }
    return book;
  }
  
  // Other methods...
}
```

Benefits:
- Decouples business logic from data access
- Centralizes data access logic
- Simplifies testing with mock repositories

## 🛡️ Security Considerations

- **JWT Authentication**: Tokens are signed with a secret key and include expiration
- **Password Hashing**: User passwords are hashed using bcrypt before storage
- **Authorization Middleware**: Protected routes verify JWT authenticity and user permissions
- **Input Validation**: All inputs are validated using Joi schemas before processing
- **Error Handling**: Custom error handling to prevent detailed error leakage

## 🧩 Design Decisions & Assumptions

1. **MongoDB Choice**: Chose MongoDB for its flexibility with book data and reviews which have varying structures
2. **Repository Pattern**: Implemented to make the database layer replaceable and testable
3. **JWT Authentication**: Selected for its stateless nature and scalability
4. **Pagination**: All list endpoints include pagination to handle large datasets efficiently
6. **Axios Interceptors**: Implemented for automatic token handling and error management

## 🔧 Extending the Application

### Switching Database 
To switch from MongoDB to another database (e.g., PostgreSQL):

1. Create new repository implementations that implement the same interfaces
   ```typescript
   export class PostgresBookRepository implements IBookRepository {
     // PostgreSQL-specific implementation
   }
   ```

2. Update the dependency injection to use the new repositories
   ```typescript
   // Instead of
   const bookRepository = new MongoBookRepository();
   
   // Use
   const bookRepository = new PostgresBookRepository();
   ```

3. No changes needed in services or controllers since they depend on interfaces

### Adding Additional Features

- **User Profiles**: Extend the User model and add profile-related endpoints
- **Book Categories**: Add a Category model and relationship to books
- **Reading Lists**: Allow users to create and share reading lists
- **User Interactions**: Add like/dislike functionality for reviews
- **Admin Dashboard**: Create admin-specific routes and components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.#   B o o k _ R e v i e w _ A P I  
 #   B o o k _ R e v i e w _ A P I _ L i v e  
 #   B o o k _ R e v i e w _ A P I _ L i v e  
 