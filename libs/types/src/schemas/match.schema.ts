import { z } from 'zod';
import { MatchStatusEnum } from '../constants';
import { BaseEntitySchema } from '../types/common.types';

// Match Schema
export const MatchSchema = BaseEntitySchema.extend({
  tournamentId: z.number(),
  eventId: z.number().optional(),
  groupId: z.number().optional(),
  player1Id: z.number(),
  player2Id: z.number(),
  player3Id: z.number().optional(), // For doubles
  player4Id: z.number().optional(), // For doubles
  refereeId: z.number().optional(),
  matchDate: z.date().or(z.string().transform((str) => new Date(str))),
  status: MatchStatusEnum.default('scheduled'),
  court: z.string().optional(),
  round: z.number().optional(),
  matchNumber: z.number().optional(),
  notes: z.string().optional(),
  tournament: z.object({
    id: z.number(),
    name: z.string()
  }).optional(),
  event: z.object({
    id: z.number(),
    name: z.string(),
    type: z.enum(['singles', 'doubles', 'mixed_doubles'])
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
  }).optional(),
  referee: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string()
  }).optional()
});

// Match Create Schema
export const MatchCreateSchema = MatchSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  tournament: true,
  event: true,
  player1: true,
  player2: true,
  player3: true,
  player4: true,
  referee: true
});

// Match Update Schema
export const MatchUpdateSchema = MatchCreateSchema.partial().extend({
  id: z.number()
});

// Match Response Schema
export const MatchResponseSchema = MatchSchema.omit({
  tournamentId: true,
  eventId: true,
  groupId: true,
  player1Id: true,
  player2Id: true,
  player3Id: true,
  player4Id: true,
  refereeId: true
});

// Match List Response Schema
export const MatchListResponseSchema = z.array(MatchResponseSchema);

// Match Search Schema
export const MatchSearchSchema = z.object({
  tournamentId: z.number().optional(),
  eventId: z.number().optional(),
  groupId: z.number().optional(),
  playerId: z.number().optional(),
  refereeId: z.number().optional(),
  status: MatchStatusEnum.optional(),
  matchDate: z.date().or(z.string().transform((str) => new Date(str))).optional(),
  court: z.string().optional()
});

// Match Filter Schema
export const MatchFilterSchema = z.object({
  tournamentId: z.array(z.number()).optional(),
  eventId: z.array(z.number()).optional(),
  groupId: z.array(z.number()).optional(),
  playerId: z.array(z.number()).optional(),
  refereeId: z.array(z.number()).optional(),
  status: z.array(MatchStatusEnum).optional(),
  dateRange: z.object({
    startDate: z.date().or(z.string().transform((str) => new Date(str))),
    endDate: z.date().or(z.string().transform((str) => new Date(str)))
  }).optional(),
  court: z.array(z.string()).optional()
});

// Match Status Update Schema
export const MatchStatusUpdateSchema = z.object({
  matchId: z.number(),
  status: MatchStatusEnum,
  reason: z.string().optional()
});

// Match Assignment Schema
export const MatchAssignmentSchema = z.object({
  matchId: z.number(),
  refereeId: z.number().optional(),
  court: z.string().optional(),
  matchDate: z.date().or(z.string().transform((str) => new Date(str))).optional()
});

// Match Schedule Schema
export const MatchScheduleSchema = z.object({
  tournamentId: z.number(),
  eventId: z.number().optional(),
  groupId: z.number().optional(),
  matches: z.array(z.object({
    player1Id: z.number(),
    player2Id: z.number(),
    player3Id: z.number().optional(),
    player4Id: z.number().optional(),
    matchDate: z.date().or(z.string().transform((str) => new Date(str))),
    court: z.string().optional(),
    round: z.number().optional()
  }))
});

