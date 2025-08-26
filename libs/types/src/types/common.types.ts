import { z } from 'zod';

// Base Entity Schema
export const BaseEntitySchema = z.object({
  id: z.number(),
  createdAt: z.date().or(z.string().transform((str) => new Date(str))),
  updatedAt: z.date().or(z.string().transform((str) => new Date(str)))
});

export type BaseEntity = z.infer<typeof BaseEntitySchema>;

// Pagination Schema
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  total: z.number().optional(),
  totalPages: z.number().optional()
});

export type Pagination = z.infer<typeof PaginationSchema>;

// Sort Schema
export const SortSchema = z.object({
  field: z.string(),
  order: z.enum(['asc', 'desc']).default('asc')
});

export type Sort = z.infer<typeof SortSchema>;

// Filter Schema
export const FilterSchema = z.object({
  field: z.string(),
  operator: z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'in', 'notIn']),
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.union([z.string(), z.number()]))])
});

export type Filter = z.infer<typeof FilterSchema>;

// Search Schema
export const SearchSchema = z.object({
  query: z.string(),
  fields: z.array(z.string()).optional()
});

export type Search = z.infer<typeof SearchSchema>;

// Date Range Schema
export const DateRangeSchema = z.object({
  startDate: z.date().or(z.string().transform((str) => new Date(str))),
  endDate: z.date().or(z.string().transform((str) => new Date(str)))
});

export type DateRange = z.infer<typeof DateRangeSchema>;

// Coordinates Schema
export const CoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});

export type Coordinates = z.infer<typeof CoordinatesSchema>;

// Address Schema
export const AddressSchema = z.object({
  street: z.string().optional(),
  city: z.string(),
  state: z.string().optional(),
  country: z.string(),
  postalCode: z.string().optional(),
  coordinates: CoordinatesSchema.optional()
});

export type Address = z.infer<typeof AddressSchema>;

