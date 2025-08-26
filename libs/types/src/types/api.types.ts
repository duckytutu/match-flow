import { z } from 'zod';

// Base API Response Schema
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    message: z.string().optional(),
    success: z.boolean(),
    error: z.string().optional(),
    timestamp: z.string().optional()
  });

export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
  error?: string;
  timestamp?: string;
};

// Paginated API Response Schema
export const PaginatedApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number()
    }),
    message: z.string().optional(),
    success: z.boolean(),
    error: z.string().optional(),
    timestamp: z.string().optional()
  });

export type PaginatedApiResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  success: boolean;
  error?: string;
  timestamp?: string;
};

// Error Response Schema
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string().optional(),
  statusCode: z.number().optional(),
  timestamp: z.string().optional(),
  details: z.record(z.string(), z.any()).optional()
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// Success Response Schema
export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
    timestamp: z.string().optional()
  });

export type SuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
  timestamp?: string;
};

// Query Parameters Schema
export const QueryParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('asc'),
  search: z.string().optional(),
  filters: z.string().optional(), // JSON string of filters
  include: z.string().optional(), // comma-separated relations to include
  select: z.string().optional() // comma-separated fields to select
});

export type QueryParams = z.infer<typeof QueryParamsSchema>;

// Bulk Operation Schema
export const BulkOperationSchema = z.object({
  ids: z.array(z.number()),
  action: z.enum(['delete', 'update', 'approve', 'reject', 'activate', 'deactivate']),
  data: z.record(z.string(), z.any()).optional()
});

export type BulkOperation = z.infer<typeof BulkOperationSchema>;

// Bulk Operation Response Schema
export const BulkOperationResponseSchema = z.object({
  success: z.boolean(),
  processed: z.number(),
  succeeded: z.number(),
  failed: z.number(),
  errors: z.array(z.object({
    id: z.number(),
    error: z.string()
  })).optional(),
  message: z.string().optional()
});

export type BulkOperationResponse = z.infer<typeof BulkOperationResponseSchema>;
