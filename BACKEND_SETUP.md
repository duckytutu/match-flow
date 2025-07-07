# Full Stack Setup với Docker và Nx

## Tổng quan

Ứng dụng sử dụng:
- **Frontend**: Next.js chạy trên port 3000
- **Backend**: NestJS chạy trên port 8000  
- **Database**: PostgreSQL chạy trên port 5432

Nx được cấu hình để quản lý tất cả services và development workflow.

## Prerequisites

- Docker và Docker Compose
- Node.js và Yarn
- Nx CLI

## Cấu hình Database

Database được cấu hình trong `docker-compose.yml`:
- **Host**: localhost
- **Port**: 5432
- **Username**: pickleball
- **Password**: pickleball
- **Database**: pickleball

## Cấu hình CORS

Backend đã được cấu hình CORS để cho phép frontend truy cập:

### Backend CORS Configuration
```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    // Allow all origins in development
    ...(process.env.NODE_ENV === 'development' ? ['*'] : [])
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
});
```

### Frontend API Configuration
```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  TIMEOUT: 10000,
};
```

### Test CORS
```bash
# Chạy script test CORS
./test-cors.sh
```

## Các Commands Nx

### Backend Commands

#### Khởi động Database
```bash
yarn nx run backend:docker:up
```

#### Dừng Database
```bash
yarn nx run backend:docker:down
```

#### Xem Logs Database
```bash
yarn nx run backend:docker:logs
```

#### Build Backend
```bash
yarn nx run backend:build
```

#### Serve Backend (development)
```bash
yarn nx run backend:serve
```

#### Serve Backend với Database
```bash
yarn nx run backend:serve:with-db
```

### Frontend Commands

#### Build Frontend
```bash
yarn nx run frontend:build
```

#### Serve Frontend (development)
```bash
yarn nx run frontend:serve
```

#### Serve Frontend với Backend
```bash
yarn nx run frontend:serve:with-backend
```

### Utility Commands

#### Dừng tất cả Services
```bash
yarn nx run backend:stop:all
pkill -f "nx serve frontend"
```

## Workflow Development

### 1. Khởi động nhanh (Full Stack)
```bash
# Chạy script test workflow
./test-backend-workflow.sh
```

### 2. Khởi động thủ công

#### Chỉ Backend
```bash
# 1. Khởi động database
yarn nx run backend:docker:up

# 2. Đợi database sẵn sàng (khoảng 10 giây)

# 3. Build và serve backend
yarn nx run backend:serve:with-db
```

#### Chỉ Frontend
```bash
# Build và serve frontend
yarn nx run frontend:serve
```

#### Full Stack
```bash
# Chạy cả frontend và backend
yarn nx run frontend:serve:with-backend
```

### 3. Kiểm tra Services
```bash
# Kiểm tra containers
docker compose ps

# Kiểm tra backend
curl http://localhost:8000

# Kiểm tra frontend
curl http://localhost:3000

# Xem API docs
open http://localhost:8000/api/docs

# Test CORS
./test-cors.sh
```

## Ports Configuration

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs
- **Database**: localhost:5432

## Troubleshooting

### CORS Issues
- Đảm bảo backend đang chạy trên port 8000
- Đảm bảo frontend đang chạy trên port 3000
- Kiểm tra CORS: `./test-cors.sh`
- Restart backend nếu cần: `pkill -f "npm run start:dev" && cd apps/backend && PORT=8000 npm run start:dev`

### Database Connection Issues
- Đảm bảo PostgreSQL container đang chạy: `docker compose ps`
- Kiểm tra logs: `yarn nx run backend:docker:logs`
- Restart database: `yarn nx run backend:docker:down && yarn nx run backend:docker:up`

### Backend Build Issues
- Clean build: `yarn nx run backend:build --skip-nx-cache`
- Kiểm tra TypeScript errors: `yarn nx run backend:lint`

### Frontend Build Issues
- Clean build: `yarn nx run frontend:build --skip-nx-cache`
- Kiểm tra TypeScript errors: `yarn nx run frontend:lint`

### Port Conflicts
- Frontend chạy trên port 3000
- Backend chạy trên port 8000
- Database chạy trên port 5432
- Đảm bảo các ports này không bị sử dụng bởi services khác

## Environment Variables

### Backend Environment Variables
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

### Frontend Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Documentation

Sau khi khởi động backend, API documentation có sẵn tại:
- **Swagger UI**: http://localhost:8000/api/docs
- **JSON Schema**: http://localhost:8000/api/docs-json

## Development Tips

1. **Hot Reload**: Cả frontend và backend đều tự động reload khi có thay đổi code
2. **Database Sync**: TypeORM tự động sync schema trong development mode
3. **Logging**: Database queries được log trong development mode
4. **CORS**: Backend đã cấu hình CORS cho frontend domain
5. **API Integration**: Frontend tự động kết nối với backend qua `NEXT_PUBLIC_API_URL`
6. **CORS Testing**: Sử dụng `./test-cors.sh` để test CORS configuration

## Production

Để deploy production:
1. Set `NODE_ENV=production`
2. Disable `synchronize` trong TypeORM config
3. Sử dụng proper JWT secret
4. Cấu hình proper CORS origins (chỉ cho phép production domain)
5. Sử dụng production database credentials
6. Build frontend: `yarn nx run frontend:build:production`
7. Build backend: `yarn nx run backend:build:production` 