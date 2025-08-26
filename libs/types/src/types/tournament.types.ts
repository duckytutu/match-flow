import { z } from 'zod';
import { TournamentSchema, TournamentCreateSchema, TournamentUpdateSchema, TournamentResponseSchema } from '../schemas/tournament.schema';
import { TournamentStatusEnum } from '../constants';

// Tournament Types
export type Tournament = z.infer<typeof TournamentSchema>;
export type TournamentCreate = z.infer<typeof TournamentCreateSchema>;
export type TournamentUpdate = z.infer<typeof TournamentUpdateSchema>;
export type TournamentResponse = z.infer<typeof TournamentResponseSchema>;

// Tournament Status Type
export type TournamentStatus = z.infer<typeof TournamentStatusEnum>;

// Extended Tournament Types with Relations
export interface TournamentWithRelations extends TournamentResponse {
  organizer?: User;
  events?: TournamentEvent[];
  groups?: TournamentGroup[];
  matches?: Match[];
}

// Tournament List Types
export interface TournamentListResponse {
  tournaments: TournamentResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tournament Search Types
export interface TournamentSearchParams {
  query?: string;
  status?: TournamentStatus;
  isApproved?: boolean;
  organizerId?: number;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Tournament Filter Types
export interface TournamentFilters {
  status?: TournamentStatus[];
  isApproved?: boolean;
  organizerId?: number[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  location?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
}

// Tournament Approval Types
export interface TournamentApproval {
  tournamentId: number;
  isApproved: boolean;
  reason?: string;
}

// Tournament Status Update Types
export interface TournamentStatusUpdate {
  tournamentId: number;
  status: TournamentStatus;
  reason?: string;
}

// Tournament Statistics Types
export interface TournamentStatistics {
  totalTournaments: number;
  tournamentsByStatus: Record<TournamentStatus, number>;
  tournamentsByMonth: Record<string, number>;
  averageParticipants: number;
  totalParticipants: number;
}

// Tournament Export Types
export interface TournamentExport {
  tournamentId: number;
  format: 'csv' | 'excel' | 'pdf';
  includeEvents: boolean;
  includeParticipants: boolean;
  includeMatches: boolean;
}

// Tournament Import Types
export interface TournamentImport {
  name: string;
  description?: string;
  location: string;
  startDate: string;
  endDate?: string;
  events?: {
    name: string;
    type: 'singles' | 'doubles' | 'mixed_doubles';
    maxParticipants: number;
  }[];
}

// Forward declarations for circular dependencies
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
