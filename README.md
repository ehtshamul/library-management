# Library Management System

A full-stack library management application built with React (frontend) and Node.js/Express (backend) featuring JWT authentication, book management, borrowing system, and review functionality.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Folder Structure](#folder-structure)

## Introduction

The Library Management System is a comprehensive web application designed to manage library operations efficiently. It provides features for both administrators and regular users, including book management, borrowing/returning books, user reviews, and analytics.

### Key Features

- **User Authentication**: JWT-based authentication with refresh token support
- **Role-based Access Control**: Admin and user roles with different permissions
- **Book Management**: Add, edit, delete, and view books with cover images
- **Borrowing System**: Borrow and return books with due date tracking
- **Review System**: Users can review books, admins can moderate reviews
- **Analytics Dashboard**: Admin dashboard with book statistics and trends
- **Search & Filter**: Search books by title, author, or category
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **Security**: XSS protection, rate limiting, CORS configuration, and input validation

### Technology Stack

**Frontend:**
- React 19.1.1
- React Router DOM 7.8.0
- Redux Toolkit 2.8.2
- Material-UI 7.3.2
- Tailwind CSS 3.4.17
- Axios 1.11.0
- Chart.js 4.5.0

**Backend:**
- Node.js 24.6.0
- Express 4.18.2
- MongoDB 8.18.0
- JWT 9.0.2
- Multer 2.0.2
- Bcrypt 6.0.0

## Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Git

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ehtshamul/library-management.git
   cd library-management
   ```

2. **Install all dependencies**
   ```bash
   npm run setup
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in the backend directory
   cd backend
   cp .env.example .env
   ```

4. **Start the application**
   ```bash
   # From the root directory
   npm run dev:full
   ```

### Manual Installation

If you prefer to install dependencies separately:

1. **Install frontend dependencies**
   ```bash
   npm install
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Start frontend and backend separately**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

## Configuration

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/library-management
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/library-management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=7000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Frontend Configuration

The frontend automatically connects to the backend via proxy configuration in `vite.config.js`. The default backend URL is `http://localhost:7000`.

To change the backend URL, update the `VITE_API_BASE_URL` environment variable:

```env
# Create .env file in the root directory
VITE_API_BASE_URL=http://localhost:7000
```

### Database Setup

1. **Local MongoDB**: Ensure MongoDB is running on your system
2. **MongoDB Atlas**: Create a cluster and get the connection string
3. **Database Collections**: The application will automatically create the following collections:
   - `users` - User accounts and authentication
   - `books` - Book information and metadata
   - `borrows` - Borrowing records and history
   - `reviews` - User reviews and ratings

## Usage

### Starting the Application

1. **Development Mode**
   ```bash
   npm run dev:full
   ```
   This starts both frontend (port 5173) and backend (port 7000) simultaneously.

2. **Production Mode**
   ```bash
   # Build frontend
   npm run build

   # Start backend
   cd backend
   npm start
   ```

### Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:7000
- **API Documentation**: http://localhost:7000/api

### User Roles and Permissions

#### Admin Users
- Access admin dashboard
- Add, edit, and delete books
- Manage user accounts
- Moderate book reviews
- View analytics and reports
- Manage borrowing records

#### Regular Users
- Browse and search books
- View book details
- Borrow and return books
- Write and edit reviews
- View borrowing history

### Key Workflows

1. **User Registration/Login**
   - Register with email and password
   - Login with credentials
   - Automatic token refresh

2. **Book Management (Admin)**
   - Add new books with cover images
   - Edit existing book information
   - Delete books from the system
   - View all books and statistics

3. **Borrowing Process**
   - Users can borrow available books
   - Set due dates for returns
   - Automatic reminders for overdue books
   - Return books through the interface

4. **Review System**
   - Users can write reviews for books
   - Admins can approve/moderate reviews
   - Display approved reviews on book pages

## API Reference

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "User"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and return access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "User"
  }
}
```

#### POST `/api/auth/refresh`
Refresh access token using refresh token.

**Response:**
```json
{
  "success": true,
  "accessToken": "new_jwt_access_token"
}
```

#### POST `/api/auth/logout`
Logout user and invalidate tokens.

### Book Management Endpoints

#### GET `/api/web/getbooks`
Get all books (public access).

**Response:**
```json
{
  "success": true,
  "books": [
    {
      "_id": "book_id",
      "title": "Book Title",
      "author": "Author Name",
      "description": "Book description",
      "coverImage": "path/to/cover.jpg",
      "category": "Fiction",
      "isbn": "1234567890",
      "available": true
    }
  ]
}
```

#### POST `/api/auth/` (Admin only)
Create a new book.

**Request Body:**
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book description",
  "category": "Fiction",
  "isbn": "1234567890"
}
```

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

#### PUT `/api/auth/:id` (Admin only)
Update an existing book.

#### DELETE `/api/auth/:id` (Admin only)
Delete a book.

### Borrowing Endpoints

#### POST `/api/auth/borrow/:bookId`
Borrow a book.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "borrow": {
    "bookId": "book_id",
    "userId": "user_id",
    "borrowDate": "2024-01-01T00:00:00.000Z",
    "dueDate": "2024-01-15T00:00:00.000Z"
  }
}
```

#### POST `/api/auth/borrow/return/:borrowId`
Return a borrowed book.

#### GET `/api/auth/borrow/:userId`
Get user's borrowing history.

### Review Endpoints

#### POST `/api/web/reviews/add`
Add a review for a book.

**Request Body:**
```json
{
  "bookId": "book_id",
  "rating": 5,
  "comment": "Great book!"
}
```

#### GET `/api/web/reviews/show/:bookId`
Get approved reviews for a book.

#### PATCH `/api/auth/reviews/approved/:id` (Admin only)
Approve a review.

### Admin Dashboard Endpoints

#### GET `/api/auth/dashboard` (Admin only)
Get admin dashboard data.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBooks": 150,
    "totalUsers": 25,
    "activeBorrows": 12,
    "recentBooks": [...],
    "statistics": {...}
  }
}
```

## Folder Structure

```
library-management/
├── backend/                          # Backend Node.js/Express application
│   ├── config/                       # Configuration files
│   │   ├── controllers/              # Route controllers
│   │   │   ├── admin/               # Admin-specific controllers
│   │   │   │   ├── Books.js         # Book management
│   │   │   │   ├── Borrow.js        # Borrowing operations
│   │   │   │   ├── User.js          # User management
│   │   │   │   └── forgetpass.js    # Password reset
│   │   │   └── web/                 # Public controllers
│   │   │       ├── getbooks.js      # Book retrieval
│   │   │       ├── Review.js        # Review management
│   │   │       └── search.js        # Search functionality
│   │   ├── middleware/              # Custom middleware
│   │   │   ├── auth.js              # Authentication middleware
│   │   │   ├── expressvailidator.js # Input validation
│   │   │   └── uploadbook.js        # File upload handling
│   │   ├── models/                  # Database models
│   │   │   └── admin/               # Mongoose schemas
│   │   │       ├── Addbook.js       # Book schema
│   │   │       ├── Borrow.js        # Borrowing schema
│   │   │       ├── review.js        # Review schema
│   │   │       └── User.js          # User schema
│   │   ├── routes/                  # API routes
│   │   │   ├── admin/               # Admin routes
│   │   │   │   ├── books.js         # Book management routes
│   │   │   │   ├── Borrow.js        # Borrowing routes
│   │   │   │   ├── Dashboard.js     # Dashboard routes
│   │   │   │   ├── User.js          # User management routes
│   │   │   │   └── forgetpassword.js # Password reset routes
│   │   │   └── web/                 # Public routes
│   │   │       ├── getbooks.js      # Book retrieval routes
│   │   │       ├── Review.js        # Review routes
│   │   │       └── search.js        # Search routes
│   │   ├── utils/                   # Utility functions
│   │   │   ├── borrowReminder.js    # Automated reminders
│   │   │   └── Token.js             # JWT utilities
│   │   └── charts/                  # Chart configurations
│   │       └── Borchart.js          # Borrowing analytics
│   ├── uploads/                     # File uploads directory
│   ├── app.js                       # Main application file
│   └── package.json                 # Backend dependencies
├── src/                             # Frontend React application
│   ├── components/                  # Reusable React components
│   │   ├── Footer.jsx               # Footer component
│   │   ├── Login.jsx                # Login form
│   │   ├── Nav.jsx                  # Navigation bar
│   │   ├── ProtectedRoute.jsx       # Route protection
│   │   ├── Siguppage.jsx            # Registration form
│   │   └── forgetpassword.jsx       # Password reset form
│   ├── pages/                       # Page components
│   │   ├── Addbook.jsx              # Add/edit book form
│   │   ├── Adminbooks.jsx           # Admin book management
│   │   ├── AdminDashboard.jsx       # Admin dashboard
│   │   ├── AdminReviews.jsx         # Review management
│   │   ├── BookDetail.jsx           # Book details page
│   │   ├── Bookesview.jsx           # Book listing page
│   │   ├── borrowform.jsx           # Borrowing form
│   │   ├── retureborrow.jsx         # Return books page
│   │   ├── review.jsx               # Review form
│   │   └── showreview.jsx           # Display reviews
│   ├── store/                       # Redux store and slices
│   │   ├── authSlice.js             # Authentication state
│   │   ├── booksSlice.js            # Books state
│   │   ├── Borrow.js                # Borrowing state
│   │   ├── reviewSlice.js           # Reviews state
│   │   └── store.js                 # Redux store configuration
│   ├── server/                      # API configuration
│   │   ├── api.js                   # Axios configuration
│   │   └── auth.js                  # Authentication helpers
│   ├── chart/                       # Chart components
│   │   └── borrowtre.jsx            # Borrowing trends chart
│   ├── assets/                      # Static assets
│   │   └── react.svg                # React logo
│   ├── App.jsx                      # Main App component
│   ├── App.css                      # Global styles
│   ├── index.css                    # Base styles
│   └── main.jsx                     # Application entry point
├── public/                          # Public static files
│   ├── landing.jpg                  # Landing page image
│   └── vite.svg                     # Vite logo
├── package.json                     # Frontend dependencies and scripts
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
├── eslint.config.js                 # ESLint configuration
└── README.md                        # This documentation file
```

### Key Directories Explained

- **`backend/config/`**: Contains all backend logic including controllers, models, routes, and middleware
- **`src/components/`**: Reusable React components used across multiple pages
- **`src/pages/`**: Main page components that represent different routes in the application
- **`src/store/`**: Redux store configuration and state management slices
- **`src/server/`**: API configuration and authentication helpers
- **`backend/uploads/`**: Directory where book cover images are stored
- **`public/`**: Static assets served directly by the web server

### File Naming Conventions

- **Components**: PascalCase (e.g., `Login.jsx`, `AdminDashboard.jsx`)
- **Utilities**: camelCase (e.g., `api.js`, `auth.js`)
- **Models**: PascalCase (e.g., `User.js`, `Addbook.js`)
- **Routes**: lowercase (e.g., `books.js`, `user.js`)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@example.com or create an issue in the GitHub repository.
