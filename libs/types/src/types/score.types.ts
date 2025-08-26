import { z } from 'zod';
import { ScoreSchema, ScoreCreateSchema, ScoreUpdateSchema, ScoreResponseSchema } from '../schemas/score.schema';

// Score Types
export type Score = z.infer<typeof ScoreSchema>;
export type ScoreCreate = z.infer<typeof ScoreCreateSchema>;
export type ScoreUpdate = z.infer<typeof ScoreUpdateSchema>;
export type ScoreResponse = z.infer<typeof ScoreResponseSchema>;

// Extended Score Types with Relations
export interface ScoreWithRelations extends ScoreResponse {
  match?: Match;
}

// Score List Types
export interface ScoreListResponse {
  scores: ScoreResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Score Search Types
export interface ScoreSearchParams {
  matchId?: number;
  tournamentId?: number;
  eventId?: number;
  winner?: number;
  minScore?: number;
  maxScore?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Score Statistics Types
export interface ScoreStatistics {
  totalMatches: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  scoresByRange: Record<string, number>;
}

// Forward declarations for circular dependencies
interface Match {
  id: number;
  tournamentId: number;
  player1Id: number;
  player2Id: number;
  player3Id?: number;
  player4Id?: number;
  refereeId?: number;
  matchDate: Date;
  status: string;
  court?: string;
  round?: number;
  matchNumber?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
