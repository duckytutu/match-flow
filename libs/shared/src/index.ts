// Shared types and interfaces
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isApproved: boolean;
}

export interface Tournament {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  isApproved: boolean;
  organizerId: number;
  organizer?: User;
}

export interface Registration {
  id: number;
  tournamentId: number;
  userId: number;
  registrationDate: string;
  status: string;
  tournament?: Tournament;
  user?: User;
}

export interface Match {
  id: number;
  tournamentId: number;
  player1Id: number;
  player2Id: number;
  player3Id?: number;
  player4Id?: number;
  refereeId?: number;
  matchDate: string;
  status: string;
  tournament?: Tournament;
  player1?: User;
  player2?: User;
  player3?: User;
  player4?: User;
  referee?: User;
}

export interface Score {
  id: number;
  matchId: number;
  player1Score: number;
  player2Score: number;
  player3Score?: number;
  player4Score?: number;
  match?: Match;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

// Constants
export const USER_ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  REFEREE: 'referee',
  ATHLETE: 'athlete',
  GUEST: 'guest'
} as const;

export const TOURNAMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ONGOING: 'ongoing',
  COMPLETED: 'completed'
} as const;

export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const; 