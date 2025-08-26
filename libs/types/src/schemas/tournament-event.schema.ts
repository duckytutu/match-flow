import { z } from 'zod';
import { EventTypeEnum } from '../constants';
import { BaseEntitySchema } from '../types/common.types';

// Tournament Event Schema
export const TournamentEventSchema = BaseEntitySchema.extend({
  tournamentId: z.number(),
  name: z.string().min(1, 'Event name is required'),
  type: EventTypeEnum,
  maxParticipants: z.number().min(1, 'Max participants must be at least 1'),
  currentParticipants: z.number().default(0),
  description: z.string().optional(),
  startDate: z.date().or(z.string().transform((str) => new Date(str))).optional(),
  endDate: z.date().or(z.string().transform((str) => new Date(str))).optional(),
  entryFee: z.number().min(0).optional(),
  prizeMoney: z.number().min(0).optional(),
  rules: z.string().optional(),
  tournament: z.object({
    id: z.number(),
    name: z.string()
  }).optional()
});

// Tournament Event Create Schema
export const TournamentEventCreateSchema = TournamentEventSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  currentParticipants: true,
  tournament: true
});

// Tournament Event Update Schema
export const TournamentEventUpdateSchema = TournamentEventCreateSchema.partial().extend({
  id: z.number()
});

// Tournament Event Response Schema
export const TournamentEventResponseSchema = TournamentEventSchema.omit({
  tournamentId: true
});

// Tournament Event List Response Schema
export const TournamentEventListResponseSchema = z.array(TournamentEventResponseSchema);

