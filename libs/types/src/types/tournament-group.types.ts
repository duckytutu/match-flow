import { z } from 'zod';
import { TournamentGroupSchema, TournamentGroupCreateSchema, TournamentGroupUpdateSchema, TournamentGroupResponseSchema } from '../schemas/tournament-group.schema';
import { GroupTypeEnum } from '../constants';

// Tournament Group Types
export type TournamentGroup = z.infer<typeof TournamentGroupSchema>;
export type TournamentGroupCreate = z.infer<typeof TournamentGroupCreateSchema>;
export type TournamentGroupUpdate = z.infer<typeof TournamentGroupUpdateSchema>;
export type TournamentGroupResponse = z.infer<typeof TournamentGroupResponseSchema>;

// Group Type
export type GroupType = z.infer<typeof GroupTypeEnum>;

// Extended Tournament Group Types with Relations
export interface TournamentGroupWithRelations extends TournamentGroupResponse {
  tournament?: Tournament;
  teams?: TournamentGroupTeam[];
  matches?: Match[];
}

// Tournament Group List Types
export interface TournamentGroupListResponse {
  groups: TournamentGroupResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
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

interface TournamentGroupTeam {
  id: number;
  groupId: number;
  teamId: number;
  teamName: string;
  player1Id: number;
  player2Id?: number;
  player3Id?: number;
  player4Id?: number;
  seed?: number;
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
