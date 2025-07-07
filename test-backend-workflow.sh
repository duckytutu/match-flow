#!/bin/bash

echo "🧪 Testing Full Stack Workflow"
echo "=============================="

# Stop any running services
echo "🛑 Stopping any running services..."
yarn nx run backend:stop:all
pkill -f 'nx serve frontend' || true

# Wait a moment
sleep 2

# Start database
echo "🐘 Starting PostgreSQL database..."
yarn nx run backend:docker:up

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Test database connection
echo "🔍 Testing database connection..."
docker compose exec postgres psql -U pickleball -d pickleball -c "SELECT version();" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Database is ready!"
else
    echo "❌ Database connection failed!"
    exit 1
fi

# Build backend
echo "🔨 Building backend..."
yarn nx run backend:build

if [ $? -eq 0 ]; then
    echo "✅ Backend build successful!"
else
    echo "❌ Backend build failed!"
    exit 1
fi

# Build frontend
echo "🔨 Building frontend..."
yarn nx run frontend:build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

# Start backend with database
echo "🚀 Starting backend with database..."
yarn nx run backend:serve:with-db &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 15

# Test backend health
echo "🔍 Testing backend health..."
curl -s http://localhost:8000 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend is running on port 8000!"
    echo "📖 API Documentation available at: http://localhost:8000/api/docs"
else
    echo "❌ Backend health check failed!"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend
echo "🚀 Starting frontend..."
yarn nx run frontend:serve &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 15

# Test frontend health
echo "🔍 Testing frontend health..."
curl -s http://localhost:3000 > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Frontend is running on port 3000!"
    echo "🌐 Frontend available at: http://localhost:3000"
else
    echo "❌ Frontend health check failed!"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

# Test API endpoints
echo "🔍 Testing API endpoints..."
echo "Testing backend root endpoint..."
curl -s http://localhost:8000

echo -e "\nTesting backend auth endpoint..."
curl -s http://localhost:8000/auth

echo -e "\n✅ All tests completed successfully!"
echo "🎉 Full stack application is ready for development!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/api/docs"
echo "🐘 Database: localhost:5432"

# Keep the services running
echo ""
echo "💡 Services are running. Use 'yarn nx run backend:stop:all && pkill -f \"nx serve frontend\"' to stop them."
echo "💡 Or press Enter to stop all services."

# Wait for user input
read -p "Press Enter to stop all services..."
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
yarn nx run backend:stop:all
echo "🛑 All services stopped." 