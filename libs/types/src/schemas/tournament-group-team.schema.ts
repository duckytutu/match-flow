import { z } from 'zod';
import { BaseEntitySchema } from '../types/common.types';

// Tournament Group Team Schema
export const TournamentGroupTeamSchema = BaseEntitySchema.extend({
  groupId: z.number(),
  teamId: z.number(),
  teamName: z.string().min(1, 'Team name is required'),
  player1Id: z.number(),
  player2Id: z.number().optional(), // For doubles
  player3Id: z.number().optional(), // For doubles
  player4Id: z.number().optional(), // For doubles
  seed: z.number().min(1).optional(),
  group: z.object({
    id: z.number(),
    name: z.string(),
    type: z.enum(['round_robin', 'single_elimination', 'double_elimination'])
  }).optional(),
  player1: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string()
  }).optional(),
  player2: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string()
  }).optional(),
  player3: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string()
  }).optional(),
  player4: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string()
  }).optional()
});

// Tournament Group Team Create Schema
export const TournamentGroupTeamCreateSchema = TournamentGroupTeamSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  group: true,
  player1: true,
  player2: true,
  player3: true,
  player4: true
});

// Tournament Group Team Update Schema
export const TournamentGroupTeamUpdateSchema = TournamentGroupTeamCreateSchema.partial().extend({
  id: z.number()
});

// Tournament Group Team Response Schema
export const TournamentGroupTeamResponseSchema = TournamentGroupTeamSchema.omit({
  groupId: true,
  teamId: true,
  player1Id: true,
  player2Id: true,
  player3Id: true,
  player4Id: true
});

// Tournament Group Team List Response Schema
export const TournamentGroupTeamListResponseSchema = z.array(TournamentGroupTeamResponseSchema);

