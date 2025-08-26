import { z } from 'zod';
import { MatchSchema, MatchCreateSchema, MatchUpdateSchema, MatchResponseSchema } from '../schemas/match.schema';
import { MatchStatusEnum } from '../constants';

// Match Types
export type Match = z.infer<typeof MatchSchema>;
export type MatchCreate = z.infer<typeof MatchCreateSchema>;
export type MatchUpdate = z.infer<typeof MatchUpdateSchema>;
export type MatchResponse = z.infer<typeof MatchResponseSchema>;

// Match Status Type
export type MatchStatus = z.infer<typeof MatchStatusEnum>;

// Extended Match Types with Relations
export interface MatchWithRelations extends MatchResponse {
  tournament?: Tournament;
  event?: TournamentEvent;
  group?: TournamentGroup;
  player1?: User;
  player2?: User;
  player3?: User;
  player4?: User;
  referee?: User;
  score?: Score;
}

// Match List Types
export interface MatchListResponse {
  matches: MatchResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Match Search Types
export interface MatchSearchParams {
  tournamentId?: number;
  eventId?: number;
  groupId?: number;
  playerId?: number;
  refereeId?: number;
  status?: MatchStatus;
  matchDate?: Date;
  court?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Match Filter Types
export interface MatchFilters {
  tournamentId?: number[];
  eventId?: number[];
  groupId?: number[];
  playerId?: number[];
  refereeId?: number[];
  status?: MatchStatus[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  court?: string[];
}

// Match Status Update Types
export interface MatchStatusUpdate {
  matchId: number;
  status: MatchStatus;
  reason?: string;
}

// Match Assignment Types
export interface MatchAssignment {
  matchId: number;
  refereeId?: number;
  court?: string;
  matchDate?: Date;
}

// Match Schedule Types
export interface MatchSchedule {
  tournamentId: number;
  eventId?: number;
  groupId?: number;
  matches: {
    player1Id: number;
    player2Id: number;
    player3Id?: number;
    player4Id?: number;
    matchDate: Date;
    court?: string;
    round?: number;
  }[];
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

interface TournamentEvent {
  id: number;
  tournamentId: number;
  name: string;
  type: "singles" | "doubles" | "mixed_doubles";
  maxParticipants: number;
  currentParticipants: number;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  entryFee?: number;
  prizeMoney?: number;
  rules?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TournamentGroup {
  id: number;
  tournamentId: number;
  name: string;
  type: "round_robin" | "single_elimination" | "double_elimination";
  maxTeams: number;
  currentTeams: number;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "organizer" | "referee" | "athlete" | "guest";
  isApproved: boolean;
  phoneNumber?: string;
  dateOfBirth?: Date;
  levelPoint?: number;
  pointSource?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Score {
  id: number;
  matchId: number;
  player1Score: number;
  player2Score: number;
  player3Score?: number;
  player4Score?: number;
  setScores?: Array<{
    setNumber: number;
    player1Score: number;
    player2Score: number;
    player3Score?: number;
    player4Score?: number;
  }>;
  winner?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
