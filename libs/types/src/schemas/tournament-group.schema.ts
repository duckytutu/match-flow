import { z } from 'zod';
import { GroupTypeEnum } from '../constants';
import { BaseEntitySchema } from '../types/common.types';

// Tournament Group Schema
export const TournamentGroupSchema = BaseEntitySchema.extend({
  tournamentId: z.number(),
  name: z.string().min(1, 'Group name is required'),
  type: GroupTypeEnum,
  maxTeams: z.number().min(1, 'Max teams must be at least 1'),
  currentTeams: z.number().default(0),
  description: z.string().optional(),
  startDate: z.date().or(z.string().transform((str) => new Date(str))).optional(),
  endDate: z.date().or(z.string().transform((str) => new Date(str))).optional(),
  tournament: z.object({
    id: z.number(),
    name: z.string()
  }).optional()
});

// Tournament Group Create Schema
export const TournamentGroupCreateSchema = TournamentGroupSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  currentTeams: true,
  tournament: true
});

// Tournament Group Update Schema
export const TournamentGroupUpdateSchema = TournamentGroupCreateSchema.partial().extend({
  id: z.number()
});

// Tournament Group Response Schema
export const TournamentGroupResponseSchema = TournamentGroupSchema.omit({
  tournamentId: true
});

// Tournament Group List Response Schema
export const TournamentGroupListResponseSchema = z.array(TournamentGroupResponseSchema);

