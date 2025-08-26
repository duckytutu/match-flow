import { z } from 'zod';
import { RegistrationStatusEnum } from '../constants';
import { BaseEntitySchema } from '../types/common.types';

// Event Registration Schema
export const EventRegistrationSchema = BaseEntitySchema.extend({
  eventId: z.number(),
  userId: z.number(),
  status: RegistrationStatusEnum.default('pending'),
  registrationDate: z.date().or(z.string().transform((str) => new Date(str))),
  partnerId: z.number().optional(), // For doubles
  notes: z.string().optional(),
  event: z.object({
    id: z.number(),
    name: z.string(),
    type: z.enum(['singles', 'doubles', 'mixed_doubles']),
    maxParticipants: z.number(),
    currentParticipants: z.number()
  }).optional(),
  user: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string()
  }).optional(),
  partner: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string()
  }).optional()
});

// Event Registration Create Schema
export const EventRegistrationCreateSchema = EventRegistrationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  registrationDate: true,
  event: true,
  user: true,
  partner: true
});

// Event Registration Update Schema
export const EventRegistrationUpdateSchema = EventRegistrationCreateSchema.partial().extend({
  id: z.number()
});

// Event Registration Response Schema
export const EventRegistrationResponseSchema = EventRegistrationSchema.omit({
  eventId: true,
  userId: true,
  partnerId: true
});

// Event Registration List Response Schema
export const EventRegistrationListResponseSchema = z.array(EventRegistrationResponseSchema);

// Event Registration Search Schema
export const EventRegistrationSearchSchema = z.object({
  eventId: z.number().optional(),
  userId: z.number().optional(),
  status: RegistrationStatusEnum.optional(),
  partnerId: z.number().optional()
});

// Event Registration Filter Schema
export const EventRegistrationFilterSchema = z.object({
  eventId: z.array(z.number()).optional(),
  userId: z.array(z.number()).optional(),
  status: z.array(RegistrationStatusEnum).optional(),
  partnerId: z.array(z.number()).optional(),
  registrationDateRange: z.object({
    startDate: z.date().or(z.string().transform((str) => new Date(str))),
    endDate: z.date().or(z.string().transform((str) => new Date(str)))
  }).optional()
});

// Event Registration Status Update Schema
export const EventRegistrationStatusUpdateSchema = z.object({
  registrationId: z.number(),
  status: RegistrationStatusEnum,
  reason: z.string().optional()
});

// Event Registration Approval Schema
export const EventRegistrationApprovalSchema = z.object({
  registrationId: z.number(),
  isApproved: z.boolean(),
  reason: z.string().optional()
});

// Event Registration Statistics Schema
export const EventRegistrationStatisticsSchema = z.object({
  totalRegistrations: z.number(),
  registrationsByStatus: z.record(z.string(), z.number()),
  registrationsByEvent: z.record(z.string(), z.number()),
  averageRegistrationsPerEvent: z.number()
});

