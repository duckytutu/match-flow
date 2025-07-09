# Frontend - Pickleball Tournament Management

Frontend application built with Next.js 15 and App Router.

## Cấu hình API

### Development (Local)
Khi chạy frontend locally, API sẽ gọi đến `http://localhost:3000` (backend).

### Production (Docker)
Khi chạy trong Docker, API sẽ gọi đến `http://backend:3000` (tên service).

## Cách chạy

### 1. Chạy với Docker (Khuyến nghị)
```bash
# Từ thư mục gốc của project
docker-compose up
```

Frontend sẽ chạy tại: http://localhost:3001
Backend sẽ chạy tại: http://localhost:3000

### 2. Chạy locally
```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

## Cấu trúc thư mục

```
src/
├── app/                    # App Router pages
│   ├── login/             # Trang đăng nhập
│   ├── register/          # Trang đăng ký
│   ├── dashboard/         # Dashboard chính
│   ├── admin/             # Dashboard admin
│   └── tournaments/       # Quản lý giải đấu
├── config/                # Cấu hình
│   └── api.ts            # API endpoints
└── lib/                   # Utilities
    └── axios.ts          # Axios instance
```

## API Configuration

### File: `src/config/api.ts`
Chứa tất cả API endpoints và cấu hình.

### File: `src/lib/axios.ts`
Axios instance với:
- Base URL configuration
- Request interceptors (tự động thêm auth token)
- Response interceptors (xử lý 401 errors)

## Environment Variables

Tạo file `.env.local` trong thư mục frontend:

```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:3000

# Production (Docker)
# NEXT_PUBLIC_API_URL=http://backend:3000
```

## Tính năng

- ✅ Authentication (Login/Register)
- ✅ Role-based access control
- ✅ Tournament management
- ✅ User management (Admin)
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Language**: TypeScript
- **State Management**: React hooks
