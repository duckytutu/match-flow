import { z } from 'zod';
import { TournamentEventSchema, TournamentEventCreateSchema, TournamentEventUpdateSchema, TournamentEventResponseSchema } from '../schemas/tournament-event.schema';
import { EventTypeEnum } from '../constants';

// Tournament Event Types
export type TournamentEvent = z.infer<typeof TournamentEventSchema>;
export type TournamentEventCreate = z.infer<typeof TournamentEventCreateSchema>;
export type TournamentEventUpdate = z.infer<typeof TournamentEventUpdateSchema>;
export type TournamentEventResponse = z.infer<typeof TournamentEventResponseSchema>;

// Event Type
export type EventType = z.infer<typeof EventTypeEnum>;

// Extended Tournament Event Types with Relations
export interface TournamentEventWithRelations extends TournamentEventResponse {
  tournament?: Tournament;
  registrations?: EventRegistration[];
  matches?: Match[];
}

// Tournament Event List Types
export interface TournamentEventListResponse {
  events: TournamentEventResponse[];
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

interface EventRegistration {
  id: number;
  eventId: number;
  userId: number;
  status: "pending" | "approved" | "rejected" | "cancelled";
  registrationDate: Date;
  partnerId?: number;
  notes?: string;
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
