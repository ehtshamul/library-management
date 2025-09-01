# Library Management System

A full-stack library management application built with React (frontend) and Node.js/Express (backend) with JWT authentication and token refresh functionality.

## 🚀 Features

- **User Authentication**: Login, Signup, Logout with JWT tokens
- **Token Refresh**: Automatic token refresh with secure refresh token rotation
- **Role-based Access Control**: Admin and User roles
- **Book Management**: Add, edit, delete, and search books
- **Review System**: User reviews with admin approval
- **File Upload**: Book cover image uploads
- **Responsive UI**: Modern React interface with Material-UI and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React 19.1.1
- Vite 7.1.2
- Redux Toolkit
- Material-UI
- Tailwind CSS
- Axios with interceptors
- React Router DOM

### Backend
- Node.js
- Express.js 4.18.2 (stable version)
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- Multer for file uploads
- CORS enabled

## 📁 Project Structure

```
library-management-main/
├── backend/                 # Node.js/Express backend
│   ├── config/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   └── utils/           # JWT utilities
│   ├── uploads/             # File uploads directory
│   ├── app.js              # Main server file
│   └── .env                # Environment variables
├── src/                     # React frontend
│   ├── components/          # Reusable components
│   ├── pages/              # Page components
│   ├── server/             # API configuration
│   ├── store/              # Redux store
│   └── App.jsx             # Main app component
└── README.md               # This file
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (.env):**
   ```bash
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_access_token_key_here_make_it_long_and_random
   JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_token_key_here_make_it_long_and_random
   
   # Token Expiration
   ACCESS_TOKEN_TTL=15m
   REFRESH_TOKEN_TTL=7d
   
   # Database
   MONGO_URI=mongodb://localhost:27017/library_management
   
   # Server Port
   PORT=7000
   
   # Environment
   NODE_ENV=development
   ```

4. **Start MongoDB service:**
   ```bash
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Windows
   net start MongoDB
   ```

5. **Run the backend server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

   The backend will run on `http://localhost:7000`

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..  # if you're in backend directory
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## 🔐 Authentication & Token Management

### JWT Token System
- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) stored in HTTP-only cookies
- **Automatic Refresh**: Frontend automatically refreshes expired tokens
- **Token Rotation**: New refresh tokens issued on each refresh

### Security Features
- HTTP-only cookies for refresh tokens
- Secure token storage in localStorage
- Automatic logout on token expiration
- CORS protection with allowed origins

## 🚨 Known Issues & Fixes Applied

### 1. Token Refresh Not Working
**Problem**: Frontend couldn't refresh expired access tokens
**Solution**: 
- Implemented proper refresh token rotation in backend
- Added comprehensive error handling in frontend API interceptors
- Fixed CORS configuration for different ports

### 2. CORS Configuration Issues
**Problem**: Frontend and backend running on different ports caused CORS errors
**Solution**:
- Added proper CORS configuration with allowed origins
- Enabled credentials for cross-origin requests
- Added error handling for CORS violations

### 3. Missing Environment Variables
**Problem**: JWT secrets not defined causing server crashes
**Solution**:
- Created comprehensive .env file template
- Added environment variable validation in server startup
- Provided clear setup instructions

### 4. Frontend API Configuration
**Problem**: API base URLs and token handling not properly configured
**Solution**:
- Fixed Vite proxy configuration for API calls
- Implemented proper axios interceptors for token management
- Added comprehensive error handling and logging

### 5. Authentication State Management
**Problem**: User state not properly managed across components
**Solution**:
- Enhanced Redux auth slice with proper state management
- Added automatic logout on token expiration
- Implemented proper error handling for auth failures

### 6. Express Version Compatibility
**Problem**: Express 5.x caused path-to-regexp errors
**Solution**:
- Downgraded to stable Express 4.18.2
- Fixed route mounting issues
- Ensured compatibility with existing middleware

## 🔧 Configuration Files

### Vite Configuration (vite.config.js)
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:7000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

### Backend CORS Configuration
```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174"
];
```

## 🚀 Running the Application

1. **Start MongoDB** (if not running)
2. **Start Backend**: `cd backend && npm run dev`
3. **Start Frontend**: `npm run dev` (in project root)
4. **Access Application**: Open `http://localhost:5173` in browser

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Books
- `GET /api/web/getbooks` - Get all books
- `POST /api/auth/` - Add new book (Admin only)
- `PUT /api/auth/:id` - Update book (Admin only)
- `DELETE /api/auth/:id` - Delete book (Admin only)

### Reviews
- `POST /api/web/add` - Add book review
- `GET /api/web/show/:id` - Get book reviews
- `DELETE /api/web/:id` - Delete review

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - Verify database name and credentials

2. **CORS Errors**
   - Check allowed origins in backend CORS configuration
   - Ensure frontend and backend ports match configuration
   - Verify credentials are enabled

3. **Token Refresh Fails**
   - Check JWT secrets in .env file
   - Verify refresh token cookie settings
   - Check browser console for detailed error logs

4. **File Upload Issues**
   - Ensure uploads directory exists and is writable
   - Check file size limits
   - Verify file type restrictions

5. **Express Version Issues**
   - Ensure Express version is 4.18.2 (stable)
   - Check for path-to-regexp errors
   - Verify route mounting syntax

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in backend .env file.

## 🔒 Security Considerations

- **Production Deployment**: Set `secure: true` for cookies in production
- **HTTPS**: Always use HTTPS in production
- **JWT Secrets**: Use strong, random secrets for JWT signing
- **Rate Limiting**: Consider implementing rate limiting for auth endpoints
- **Input Validation**: All user inputs are validated using express-validator

## 📚 Dependencies

### Backend Dependencies
- express: ^4.18.2 (stable version)
- mongoose: ^8.18.0
- jsonwebtoken: ^9.0.2
- bcryptjs: ^3.0.2
- cors: ^2.8.5
- cookie-parser: ^1.4.7
- multer: ^2.0.2

### Frontend Dependencies
- react: ^19.1.1
- @reduxjs/toolkit: ^2.8.2
- axios: ^1.11.0
- @mui/material: ^7.3.1
- tailwindcss: ^3.4.17

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the console logs for error details
3. Ensure all dependencies are properly installed
4. Verify environment variables are set correctly

---

**Note**: This project is configured for development. For production deployment, ensure proper security measures are implemented including HTTPS, secure cookies, and environment-specific configurations.