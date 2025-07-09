# Logout Function Implementation

## Backend Changes

### 1. JWT Auth Guard
Created `backend/src/auth/jwt-auth.guard.ts`:
```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### 2. Logout Endpoint
Added to `backend/src/auth/auth.controller.ts`:
```typescript
@Post('logout')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiOperation({ summary: 'Logout user' })
@ApiResponse({ status: 200, description: 'Logout successful' })
logout(@Request() req) {
  return { message: 'Logout successful' };
}
```

## Frontend Changes

### 1. useAuth Hook
Created `frontend/src/hooks/useAuth.ts` with:
- Authentication state management
- Login/Register/Logout functions
- Role-based access control helpers

### 2. Navigation Component
Created `frontend/src/components/Navigation.tsx` with:
- Consistent navigation bar
- User info display
- Logout button

### 3. Updated Pages
- **Login**: Uses `useAuth` hook for authentication
- **Register**: Uses `useAuth` hook for registration
- **Dashboard**: Uses `Navigation` component and `useAuth` hook
- **Admin**: Uses `Navigation` component

## How to Use

### 1. In Components
```typescript
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, logout, isAdmin, isOrganizer } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <button onClick={handleLogout}>
      Đăng xuất
    </button>
  );
}
```

### 2. Navigation Component
```typescript
import Navigation from '@/components/Navigation';

export default function Layout() {
  return (
    <div>
      <Navigation />
      {/* Your content */}
    </div>
  );
}
```

## Features

- ✅ Automatic token management
- ✅ Role-based access control
- ✅ Consistent UI across pages
- ✅ Error handling
- ✅ Loading states
- ✅ Automatic redirect after logout

## API Endpoints

- `POST /auth/logout` - Logout endpoint (requires authentication)
- `POST /auth/login` - Login endpoint
- `POST /auth/register` - Register endpoint

## Security Notes

- Logout clears local storage token
- Automatic redirect to login page
- API call to backend logout endpoint (for future token blacklisting)
- CORS enabled for all origins in development 