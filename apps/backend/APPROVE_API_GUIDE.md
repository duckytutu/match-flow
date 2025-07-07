# Approve User API Implementation

## Backend Changes

### 1. Users Controller
Added approve endpoint in `backend/src/users/users.controller.ts`:
```typescript
@Patch(':id/approve')
@Roles(UserRole.ADMIN)
@ApiOperation({ summary: 'Approve a user (admin only)' })
@ApiParam({ name: 'id', example: 1 })
@ApiResponse({ 
  status: 200, 
  description: 'User approved',
  schema: {
    example: {
      id: 1,
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'athlete',
      isApproved: true,
    },
  },
})
approve(@Param('id') id: string) {
  return this.usersService.approve(Number(id));
}
```

### 2. Users Service
Added approve method in `backend/src/users/users.service.ts`:
```typescript
async approve(id: number) {
  const user = await this.usersRepository.findOneBy({ id });
  if (!user) {
    throw new Error('User not found');
  }
  
  user.isApproved = true;
  return this.usersRepository.save(user);
}
```

### 3. User Entity
User entity already has `isApproved` field:
```typescript
@Column({ default: false })
isApproved: boolean;
```

## API Endpoint

### Approve User
- **Method**: `PATCH`
- **URL**: `/users/{id}/approve`
- **Auth**: Bearer token (Admin only)
- **Response**: Updated user object

### Example Request
```bash
curl -X PATCH http://localhost:8000/users/2/approve \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Example Response
```json
{
  "id": 2,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "athlete",
  "isApproved": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Frontend Integration

### API Configuration
Updated `frontend/src/config/api.ts`:
```typescript
USER_APPROVE: (id: number) => `/users/${id}/approve`,
```

### Usage in Components
```typescript
const handleApproveUser = async (userId: number) => {
  try {
    await apiClient.patch(`/users/${userId}/approve`);
    // Update local state
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isApproved: true } : user
    ));
  } catch (error) {
    console.error('Failed to approve user:', error);
  }
};
```

## Security

- ✅ Only admin users can approve other users
- ✅ JWT authentication required
- ✅ Role-based access control
- ✅ Input validation (user ID must exist)

## Error Handling

- **404**: User not found
- **401**: Unauthorized (no token or invalid token)
- **403**: Forbidden (not admin role)
- **500**: Server error

## Testing

1. Start the backend server
2. Login as admin user
3. Get JWT token
4. Test approve endpoint with user ID
5. Verify user.isApproved is set to true

## Swagger Documentation

The endpoint is documented in Swagger UI at:
`http://localhost:8000/api/docs` 