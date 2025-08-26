import { z } from 'zod';
import { EventRegistrationSchema, EventRegistrationCreateSchema, EventRegistrationUpdateSchema, EventRegistrationResponseSchema } from '../schemas/event-registration.schema';
import { RegistrationStatusEnum } from '../constants';

// Event Registration Types
export type EventRegistration = z.infer<typeof EventRegistrationSchema>;
export type EventRegistrationCreate = z.infer<typeof EventRegistrationCreateSchema>;
export type EventRegistrationUpdate = z.infer<typeof EventRegistrationUpdateSchema>;
export type EventRegistrationResponse = z.infer<typeof EventRegistrationResponseSchema>;

// Registration Status Type
export type RegistrationStatus = z.infer<typeof RegistrationStatusEnum>;

// Extended Event Registration Types with Relations
export interface EventRegistrationWithRelations extends EventRegistrationResponse {
  event?: TournamentEvent;
  user?: User;
  partner?: User;
}

// Event Registration List Types
export interface EventRegistrationListResponse {
  registrations: EventRegistrationResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Event Registration Search Types
export interface EventRegistrationSearchParams {
  eventId?: number;
  userId?: number;
  status?: RegistrationStatus;
  partnerId?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Event Registration Filter Types
export interface EventRegistrationFilters {
  eventId?: number[];
  userId?: number[];
  status?: RegistrationStatus[];
  partnerId?: number[];
  registrationDateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

// Event Registration Status Update Types
export interface EventRegistrationStatusUpdate {
  registrationId: number;
  status: RegistrationStatus;
  reason?: string;
}

// Event Registration Approval Types
export interface EventRegistrationApproval {
  registrationId: number;
  isApproved: boolean;
  reason?: string;
}

// Event Registration Statistics Types
export interface EventRegistrationStatistics {
  totalRegistrations: number;
  registrationsByStatus: Record<RegistrationStatus, number>;
  registrationsByEvent: Record<string, number>;
  averageRegistrationsPerEvent: number;
}

// Forward declarations for circular dependencies
interface TournamentEvent {
  id: number;
  tournamentId: number;
  name: string;
  type: "singles" | "doubles" | "mixed_doubles";
  maxParticipants: number;
  currentParticipants: number;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  entryFee?: number;
  prizeMoney?: number;
  rules?: string;
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
