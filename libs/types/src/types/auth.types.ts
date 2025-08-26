import { z } from 'zod';
import { UserRoleEnum } from '../constants';

// Login Request Schema
export const LoginRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

// Login Response Schema
export const LoginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  user: z.object({
    id: z.number(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    role: UserRoleEnum,
    isApproved: z.boolean()
  }),
  expires_in: z.number().optional(),
  token_type: z.string().default('Bearer')
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// Register Request Schema
export const RegisterRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  levelPoint: z.number().min(1.0).max(5.0).optional(),
  pointSource: z.enum(['self_rated', 'sport_connect']).optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

// Register Response Schema
export const RegisterResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: z.object({
    id: z.number(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    role: UserRoleEnum,
    isApproved: z.boolean()
  }).optional()
});

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;

// Change Password Request Schema
export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmNewPassword: z.string().min(6, 'Confirm password must be at least 6 characters')
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"]
});

export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;

// Forgot Password Request Schema
export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email('Invalid email format')
});

export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;

// Reset Password Request Schema
export const ResetPasswordRequestSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmNewPassword: z.string().min(6, 'Confirm password must be at least 6 characters')
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"]
});

export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

// Refresh Token Request Schema
export const RefreshTokenRequestSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required')
});

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

// Refresh Token Response Schema
export const RefreshTokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  expires_in: z.number().optional(),
  token_type: z.string().default('Bearer')
});

export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;

// User Profile Update Schema
export const UserProfileUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').optional(),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  levelPoint: z.number().min(1.0).max(5.0).optional(),
  pointSource: z.enum(['self_rated', 'sport_connect']).optional()
});

export type UserProfileUpdate = z.infer<typeof UserProfileUpdateSchema>;

// JWT Payload Schema
export const JwtPayloadSchema = z.object({
  sub: z.number(), // user id
  email: z.string(),
  role: UserRoleEnum,
  iat: z.number(), // issued at
  exp: z.number() // expiration
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

