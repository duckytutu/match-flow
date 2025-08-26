import { z } from 'zod';
import { UserSchema, UserCreateSchema, UserUpdateSchema, UserResponseSchema } from '../schemas/user.schema';
import { UserRoleEnum } from '../constants';

// User Types
export type User = z.infer<typeof UserSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;

// User Role Type
export type UserRole = z.infer<typeof UserRoleEnum>;

// Extended User Types with Relations
export interface UserWithRelations extends UserResponse {
  organizedTournaments?: Tournament[];
  eventRegistrations?: EventRegistration[];
  refereedMatches?: Match[];
}

// User List Types
export interface UserListResponse {
  users: UserResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User Search Types
export interface UserSearchParams {
  query?: string;
  role?: UserRole;
  isApproved?: boolean;
  levelPoint?: number;
  pointSource?: 'self_rated' | 'sport_connect';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// User Filter Types
export interface UserFilters {
  role?: UserRole[];
  isApproved?: boolean;
  levelPointRange?: {
    min: number;
    max: number;
  };
  pointSource?: ('self_rated' | 'sport_connect')[];
  createdAfter?: Date;
  createdBefore?: Date;
}

// User Bulk Operation Types
export interface UserBulkUpdate {
  ids: number[];
  updates: Partial<Omit<UserCreate, 'id'>>;
}

export interface UserApproval {
  userId: number;
  isApproved: boolean;
  reason?: string;
}

export interface UserRoleUpdate {
  userId: number;
  role: UserRole;
  reason?: string;
}

export interface UserLevelPointUpdate {
  userId: number;
  levelPoint: number;
  pointSource: 'self_rated' | 'sport_connect';
  reason?: string;
}

// User Statistics Types
export interface UserStatistics {
  totalUsers: number;
  approvedUsers: number;
  pendingUsers: number;
  usersByRole: Record<UserRole, number>;
  usersByLevelPoint: Record<string, number>;
  usersByPointSource: Record<string, number>;
}

// User Import/Export Types
export interface UserImportData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  dateOfBirth?: string;
  levelPoint?: number;
  pointSource?: 'self_rated' | 'sport_connect';
}

export interface UserExportData extends UserResponse {
  exportDate: string;
  exportedBy: string;
}

// User Validation Types
export interface UserValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// User Permission Types
export interface UserPermissions {
  canCreateTournament: boolean;
  canEditTournament: boolean;
  canDeleteTournament: boolean;
  canApproveUsers: boolean;
  canManageMatches: boolean;
  canViewAllUsers: boolean;
  canEditUserRoles: boolean;
}

// Forward declarations for circular dependencies
interface Tournament {
  id: number;
  name: string;
  description?: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  status: "draft" | "published" | "registration_open" | "registration_closed" | "in_progress" | "completed" | "cancelled";
  isApproved: boolean;
  organizerId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface EventRegistration {
  id: number;
  eventId: number;
  userId: number;
  status: "pending" | "approved" | "rejected" | "cancelled";
  registrationDate: Date;
  partnerId?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Match {
  id: number;
  tournamentId: number;
  player1Id: number;
  player2Id: number;
  player3Id?: number;
  player4Id?: number;
  refereeId?: number;
  matchDate: Date;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  court?: string;
  round?: number;
  matchNumber?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
