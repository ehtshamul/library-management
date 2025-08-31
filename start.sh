#!/bin/bash

echo "🚀 Starting Library Management System..."

# Check if MongoDB is running
echo "📊 Checking MongoDB status..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   Ubuntu/Debian: sudo systemctl start mongod"
    echo "   macOS: brew services start mongodb-community"
    echo "   Windows: net start MongoDB"
    echo ""
    read -p "Press Enter to continue anyway, or Ctrl+C to exit..."
else
    echo "✅ MongoDB is running"
fi

# Check if .env file exists in backend
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Creating default .env file..."
    cd backend
    cat > .env << 'EOF'
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
EOF
    echo "✅ Created .env file in backend directory"
    cd ..
fi

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start backend server
echo "🔧 Starting backend server..."
cd backend
npm install --silent
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting frontend server..."
npm install --silent
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting..."
echo "🌐 Backend: http://localhost:7000"
echo "🎨 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait
