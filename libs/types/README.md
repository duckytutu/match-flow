# @pickleball-poc/types

Thư viện types và schemas sử dụng Zod để share typing giữa frontend và backend.

## Cài đặt

Lib này đã được cài đặt sẵn trong workspace. Để sử dụng, chỉ cần import:

```typescript
import { User, Tournament, Match } from '@pickleball-poc/types';
```

## Cấu trúc

### Constants
- `UserRoleEnum` - Enum cho user roles (admin, organizer, referee, athlete, guest)
- `TournamentStatusEnum` - Enum cho tournament status
- `MatchStatusEnum` - Enum cho match status
- `RegistrationStatusEnum` - Enum cho registration status
- `EventTypeEnum` - Enum cho event types (singles, doubles, mixed_doubles)
- `GroupTypeEnum` - Enum cho group types

### Schemas (Zod)
- `UserSchema` - Schema validation cho User entity
- `TournamentSchema` - Schema validation cho Tournament entity
- `MatchSchema` - Schema validation cho Match entity
- `ScoreSchema` - Schema validation cho Score entity
- `EventRegistrationSchema` - Schema validation cho EventRegistration entity
- `TournamentEventSchema` - Schema validation cho TournamentEvent entity
- `TournamentGroupSchema` - Schema validation cho TournamentGroup entity
- `TournamentGroupTeamSchema` - Schema validation cho TournamentGroupTeam entity

### Types (TypeScript)
- `User`, `UserCreate`, `UserUpdate`, `UserResponse`
- `Tournament`, `TournamentCreate`, `TournamentUpdate`, `TournamentResponse`
- `Match`, `MatchCreate`, `MatchUpdate`, `MatchResponse`
- `Score`, `ScoreCreate`, `ScoreUpdate`, `ScoreResponse`
- `EventRegistration`, `EventRegistrationCreate`, `EventRegistrationUpdate`, `EventRegistrationResponse`
- `TournamentEvent`, `TournamentEventCreate`, `TournamentEventUpdate`, `TournamentEventResponse`
- `TournamentGroup`, `TournamentGroupCreate`, `TournamentGroupUpdate`, `TournamentGroupResponse`
- `TournamentGroupTeam`, `TournamentGroupTeamCreate`, `TournamentGroupTeamUpdate`, `TournamentGroupTeamResponse`

### Common Types
- `BaseEntity` - Base interface cho tất cả entities
- `Pagination` - Interface cho pagination
- `Sort` - Interface cho sorting
- `Filter` - Interface cho filtering
- `Search` - Interface cho search
- `DateRange` - Interface cho date range
- `Coordinates` - Interface cho coordinates
- `Address` - Interface cho address

### API Types
- `ApiResponse<T>` - Generic API response interface
- `PaginatedApiResponse<T>` - Paginated API response interface
- `ErrorResponse` - Error response interface
- `SuccessResponse<T>` - Success response interface
- `QueryParams` - Query parameters interface
- `BulkOperation` - Bulk operation interface

### Auth Types
- `LoginRequest`, `LoginResponse`
- `RegisterRequest`, `RegisterResponse`
- `ChangePasswordRequest`
- `ForgotPasswordRequest`, `ResetPasswordRequest`
- `RefreshTokenRequest`, `RefreshTokenResponse`
- `UserProfileUpdate`
- `JwtPayload`

## Sử dụng

### Frontend (Next.js)

```typescript
import { 
  User, 
  Tournament, 
  Match,
  UserCreate,
  TournamentCreate,
  LoginRequest,
  ApiResponse 
} from '@pickleball-poc/types';

// Sử dụng types
const user: User = {
  id: 1,
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'athlete',
  isApproved: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Sử dụng schemas để validate
import { UserSchema } from '@pickleball-poc/types';

const validateUser = (data: unknown) => {
  return UserSchema.parse(data);
};

// Sử dụng API types
const response: ApiResponse<User> = await api.get('/users/1');
```

### Backend (NestJS)

```typescript
import { 
  User, 
  Tournament, 
  Match,
  UserCreate,
  TournamentCreate,
  LoginRequest,
  ApiResponse 
} from '@pickleball-poc/types';

// Sử dụng types trong DTOs
export class CreateUserDto implements UserCreate {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// Sử dụng schemas để validate
import { UserSchema } from '@pickleball-poc/types';

@Post()
async createUser(@Body() createUserDto: CreateUserDto) {
  // Validate data
  const validatedData = UserSchema.parse(createUserDto);
  
  // Process data
  const user = await this.usersService.create(validatedData);
  
  return {
    data: user,
    success: true,
    message: 'User created successfully'
  } as ApiResponse<User>;
}
```

## Validation với Zod

Tất cả schemas đều sử dụng Zod để validation:

```typescript
import { UserSchema, TournamentSchema } from '@pickleball-poc/types';

// Validate user data
const userData = {
  email: 'invalid-email',
  firstName: 'John',
  lastName: 'Doe'
};

try {
  const validatedUser = UserSchema.parse(userData);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log('Validation errors:', error.errors);
  }
}

// Safe parse (không throw error)
const result = UserSchema.safeParse(userData);
if (result.success) {
  const user = result.data;
} else {
  console.log('Validation errors:', result.error.errors);
}
```

## Extending Types

Để extend types với relations:

```typescript
import { User, Tournament, Match } from '@pickleball-poc/types';

interface UserWithTournaments extends User {
  organizedTournaments?: Tournament[];
  participatedMatches?: Match[];
}

interface TournamentWithDetails extends Tournament {
  organizer: User;
  events: TournamentEvent[];
  participants: User[];
}
```

## Best Practices

1. **Luôn sử dụng types từ lib này** thay vì định nghĩa lại
2. **Sử dụng schemas để validate** data từ API hoặc user input
3. **Extend types khi cần** thay vì tạo mới hoàn toàn
4. **Sử dụng constants** thay vì hardcode strings
5. **Import specific types** thay vì import tất cả

## Build

Để build lib này:

```bash
nx build types
```

## Test

Để test lib này:

```bash
nx test types
```

