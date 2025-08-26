import { z } from 'zod';
import { BaseEntitySchema } from '../types/common.types';

// Score Schema
export const ScoreSchema = BaseEntitySchema.extend({
  matchId: z.number(),
  player1Score: z.number().min(0),
  player2Score: z.number().min(0),
  player3Score: z.number().min(0).optional(), // For doubles
  player4Score: z.number().min(0).optional(), // For doubles
  setScores: z.array(z.object({
    setNumber: z.number().min(1),
    player1Score: z.number().min(0),
    player2Score: z.number().min(0),
    player3Score: z.number().min(0).optional(),
    player4Score: z.number().min(0).optional()
  })).optional(),
  winner: z.number().optional(), // Player ID who won
  notes: z.string().optional(),
  match: z.object({
    id: z.number(),
    tournamentId: z.number(),
    eventId: z.number().optional()
  }).optional()
});

// Score Create Schema
export const ScoreCreateSchema = ScoreSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  match: true
});

// Score Update Schema
export const ScoreUpdateSchema = ScoreCreateSchema.partial().extend({
  id: z.number()
});

// Score Response Schema
export const ScoreResponseSchema = ScoreSchema.omit({
  matchId: true
});

// Score List Response Schema
export const ScoreListResponseSchema = z.array(ScoreResponseSchema);

// Score Search Schema
export const ScoreSearchSchema = z.object({
  matchId: z.number().optional(),
  tournamentId: z.number().optional(),
  eventId: z.number().optional(),
  winner: z.number().optional(),
  minScore: z.number().min(0).optional(),
  maxScore: z.number().min(0).optional()
});

// Score Statistics Schema
export const ScoreStatisticsSchema = z.object({
  totalMatches: z.number(),
  averageScore: z.number(),
  highestScore: z.number(),
  lowestScore: z.number(),
  scoresByRange: z.record(z.string(), z.number())
});
