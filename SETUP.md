# Setup Guide

## Environment Variables

### Frontend Setup

1. Copy environment template:
```bash
cp env.example apps/frontend/.env.local
```

2. Update `apps/frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
PORT=3000
```

### Backend Setup

1. Copy environment template:
```bash
cp env.example apps/backend/.env
```

2. Update `apps/backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=pickleball
DB_PASSWORD=pickleball
DB_NAME=pickleball
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
PORT=8000
```

## Quick Start

1. Install dependencies:
```bash
yarn install
```

2. Start database:
```bash
yarn nx run backend:docker:up
```

3. Start backend:
```bash
yarn nx run backend:serve:with-db
```

4. Start frontend:
```bash
yarn nx run frontend:serve
```

## Development

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/api/docs
- **Database**: localhost:5432

## Testing

- Test CORS: `./test-cors.sh`
- Test full workflow: `./test-backend-workflow.sh`

## Documentation

- [Backend Setup](BACKEND_SETUP.md) 