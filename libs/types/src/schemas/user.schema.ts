import { z } from 'zod';
import { UserRoleEnum } from '../constants';
import { BaseEntitySchema } from '../types/common.types';

// User Schema
export const UserSchema = BaseEntitySchema.extend({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  role: UserRoleEnum,
  isApproved: z.boolean().default(false),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.date().or(z.string().transform((str) => new Date(str))).optional(),
  levelPoint: z.number().min(1.0).max(5.0).optional(),
  pointSource: z.enum(['self_rated', 'sport_connect']).optional()
});

// User Create Schema (without id, createdAt, updatedAt)
export const UserCreateSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// User Update Schema (all fields optional except id)
export const UserUpdateSchema = UserCreateSchema.partial().extend({
  id: z.number()
});

// User Response Schema (without password)
export const UserResponseSchema = UserSchema.omit({
  password: true
});

// User List Response Schema
export const UserListResponseSchema = z.array(UserResponseSchema);

// User Search Schema
export const UserSearchSchema = z.object({
  query: z.string().optional(),
  role: UserRoleEnum.optional(),
  isApproved: z.boolean().optional(),
  levelPoint: z.number().min(1.0).max(5.0).optional(),
  pointSource: z.enum(['self_rated', 'sport_connect']).optional()
});

// User Filter Schema
export const UserFilterSchema = z.object({
  role: z.array(UserRoleEnum).optional(),
  isApproved: z.boolean().optional(),
  levelPointRange: z.object({
    min: z.number().min(1.0).max(5.0),
    max: z.number().min(1.0).max(5.0)
  }).optional(),
  pointSource: z.array(z.enum(['self_rated', 'sport_connect'])).optional(),
  createdAfter: z.date().or(z.string().transform((str) => new Date(str))).optional(),
  createdBefore: z.date().or(z.string().transform((str) => new Date(str))).optional()
});

// User Bulk Update Schema
export const UserBulkUpdateSchema = z.object({
  ids: z.array(z.number()),
  updates: UserUpdateSchema.partial().omit({ id: true })
});

// User Approval Schema
export const UserApprovalSchema = z.object({
  userId: z.number(),
  isApproved: z.boolean(),
  reason: z.string().optional()
});

// User Role Update Schema
export const UserRoleUpdateSchema = z.object({
  userId: z.number(),
  role: UserRoleEnum,
  reason: z.string().optional()
});

// User Level Point Update Schema
export const UserLevelPointUpdateSchema = z.object({
  userId: z.number(),
  levelPoint: z.number().min(1.0).max(5.0),
  pointSource: z.enum(['self_rated', 'sport_connect']),
  reason: z.string().optional()
});

