import { z } from 'zod';

// User Role Enum
export const UserRoleEnum = z.enum(['admin', 'organizer', 'referee', 'athlete', 'guest']);
export type UserRole = z.infer<typeof UserRoleEnum>;

// Tournament Status Enum
export const TournamentStatusEnum = z.enum([
  'draft',
  'published',
  'registration_open',
  'registration_closed',
  'in_progress',
  'completed',
  'cancelled'
]);
export type TournamentStatus = z.infer<typeof TournamentStatusEnum>;

// Match Status Enum
export const MatchStatusEnum = z.enum([
  'scheduled',
  'in_progress',
  'completed',
  'cancelled'
]);
export type MatchStatus = z.infer<typeof MatchStatusEnum>;

// Registration Status Enum
export const RegistrationStatusEnum = z.enum([
  'pending',
  'approved',
  'rejected',
  'cancelled'
]);
export type RegistrationStatus = z.infer<typeof RegistrationStatusEnum>;

// Event Type Enum
export const EventTypeEnum = z.enum([
  'singles',
  'doubles',
  'mixed_doubles'
]);
export type EventType = z.infer<typeof EventTypeEnum>;

// Group Type Enum
export const GroupTypeEnum = z.enum([
  'round_robin',
  'single_elimination',
  'double_elimination'
]);
export type GroupType = z.infer<typeof GroupTypeEnum>;

// Constants
export const USER_ROLES = {
  ADMIN: 'admin' as const,
  ORGANIZER: 'organizer' as const,
  REFEREE: 'referee' as const,
  ATHLETE: 'athlete' as const,
  GUEST: 'guest' as const
};

export const TOURNAMENT_STATUS = {
  DRAFT: 'draft' as const,
  PUBLISHED: 'published' as const,
  REGISTRATION_OPEN: 'registration_open' as const,
  REGISTRATION_CLOSED: 'registration_closed' as const,
  IN_PROGRESS: 'in_progress' as const,
  COMPLETED: 'completed' as const,
  CANCELLED: 'cancelled' as const
};

export const MATCH_STATUS = {
  SCHEDULED: 'scheduled' as const,
  IN_PROGRESS: 'in_progress' as const,
  COMPLETED: 'completed' as const,
  CANCELLED: 'cancelled' as const
};

export const REGISTRATION_STATUS = {
  PENDING: 'pending' as const,
  APPROVED: 'approved' as const,
  REJECTED: 'rejected' as const,
  CANCELLED: 'cancelled' as const
};

export const EVENT_TYPES = {
  SINGLES: 'singles' as const,
  DOUBLES: 'doubles' as const,
  MIXED_DOUBLES: 'mixed_doubles' as const
};

export const GROUP_TYPES = {
  ROUND_ROBIN: 'round_robin' as const,
  SINGLE_ELIMINATION: 'single_elimination' as const,
  DOUBLE_ELIMINATION: 'double_elimination' as const
};

