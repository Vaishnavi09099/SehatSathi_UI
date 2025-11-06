#!/bin/bash

# SehatSathi - Start Script
# This script starts both frontend and backend servers

echo "🏥 Starting SehatSathi Platform..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  Warning: MongoDB doesn't appear to be running"
    echo "   Please start MongoDB first: mongod"
    echo ""
fi

# Start Backend
echo "🔧 Starting Backend Server (Port 5000)..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start Frontend
echo "🎨 Starting Frontend Server (Port 5173)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ SehatSathi Platform Started!"
echo ""
echo "📍 Access Points:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "👥 Demo Accounts:"
echo "   Patient: patient@sehatsathi.in / demo123"
echo "   Doctor:  doctor@sehatsathi.in / demo123"
echo "   ASHA:    asha@sehatsathi.in / demo123"
echo "   Admin:   admin@sehatsathi.in / demo123"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
