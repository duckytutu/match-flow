import { z } from 'zod';
import { TournamentGroupTeamSchema, TournamentGroupTeamCreateSchema, TournamentGroupTeamUpdateSchema, TournamentGroupTeamResponseSchema } from '../schemas/tournament-group-team.schema';

// Tournament Group Team Types
export type TournamentGroupTeam = z.infer<typeof TournamentGroupTeamSchema>;
export type TournamentGroupTeamCreate = z.infer<typeof TournamentGroupTeamCreateSchema>;
export type TournamentGroupTeamUpdate = z.infer<typeof TournamentGroupTeamUpdateSchema>;
export type TournamentGroupTeamResponse = z.infer<typeof TournamentGroupTeamResponseSchema>;

// Extended Tournament Group Team Types with Relations
export interface TournamentGroupTeamWithRelations extends TournamentGroupTeamResponse {
  group?: TournamentGroup;
  player1?: User;
  player2?: User;
  player3?: User;
  player4?: User;
}

// Tournament Group Team List Types
export interface TournamentGroupTeamListResponse {
  teams: TournamentGroupTeamResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Forward declarations for circular dependencies
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
