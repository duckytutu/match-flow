import { z } from 'zod';
import { TournamentStatusEnum } from '../constants';
import { BaseEntitySchema } from '../types/common.types';

// Tournament Schema
export const TournamentSchema = BaseEntitySchema.extend({
  name: z.string().min(3, 'Tournament name must be at least 3 characters'),
  description: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  startDate: z.date().or(z.string().transform((str) => new Date(str))),
  endDate: z.date().or(z.string().transform((str) => new Date(str))).optional(),
  status: TournamentStatusEnum.default('draft'),
  isApproved: z.boolean().default(false),
  organizerId: z.number(),
  organizer: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    role: z.enum(['admin', 'organizer', 'referee', 'athlete', 'guest'])
  }).optional(),
  events: z.array(z.object({
    id: z.number(),
    name: z.string(),
    type: z.enum(['singles', 'doubles', 'mixed_doubles']),
    maxParticipants: z.number().min(1),
    currentParticipants: z.number().default(0)
  })).optional()
});

// Tournament Create Schema
export const TournamentCreateSchema = TournamentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  organizer: true,
  events: true
});

// Tournament Update Schema
export const TournamentUpdateSchema = TournamentCreateSchema.partial().extend({
  id: z.number()
});

// Tournament Response Schema
export const TournamentResponseSchema = TournamentSchema.omit({
  organizerId: true
});

// Tournament List Response Schema
export const TournamentListResponseSchema = z.array(TournamentResponseSchema);

// Tournament Search Schema
export const TournamentSearchSchema = z.object({
  query: z.string().optional(),
  status: TournamentStatusEnum.optional(),
  isApproved: z.boolean().optional(),
  organizerId: z.number().optional(),
  startDate: z.date().or(z.string().transform((str) => new Date(str))).optional(),
  endDate: z.date().or(z.string().transform((str) => new Date(str))).optional(),
  location: z.string().optional()
});

// Tournament Filter Schema
export const TournamentFilterSchema = z.object({
  status: z.array(TournamentStatusEnum).optional(),
  isApproved: z.boolean().optional(),
  organizerId: z.array(z.number()).optional(),
  dateRange: z.object({
    startDate: z.date().or(z.string().transform((str) => new Date(str))),
    endDate: z.date().or(z.string().transform((str) => new Date(str)))
  }).optional(),
  location: z.array(z.string()).optional(),
  createdAfter: z.date().or(z.string().transform((str) => new Date(str))).optional(),
  createdBefore: z.date().or(z.string().transform((str) => new Date(str))).optional()
});

// Tournament Approval Schema
export const TournamentApprovalSchema = z.object({
  tournamentId: z.number(),
  isApproved: z.boolean(),
  reason: z.string().optional()
});

// Tournament Status Update Schema
export const TournamentStatusUpdateSchema = z.object({
  tournamentId: z.number(),
  status: TournamentStatusEnum,
  reason: z.string().optional()
});

// Tournament Statistics Schema
export const TournamentStatisticsSchema = z.object({
  totalTournaments: z.number(),
  tournamentsByStatus: z.record(z.string(), z.number()),
  tournamentsByMonth: z.record(z.string(), z.number()),
  averageParticipants: z.number(),
  totalParticipants: z.number()
});

// Tournament Export Schema
export const TournamentExportSchema = z.object({
  tournamentId: z.number(),
  format: z.enum(['csv', 'excel', 'pdf']),
  includeEvents: z.boolean().default(true),
  includeParticipants: z.boolean().default(true),
  includeMatches: z.boolean().default(false)
});

// Tournament Import Schema
export const TournamentImportSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  location: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  events: z.array(z.object({
    name: z.string(),
    type: z.enum(['singles', 'doubles', 'mixed_doubles']),
    maxParticipants: z.number().min(1)
  })).optional()
});

