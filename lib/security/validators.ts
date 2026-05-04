import { z } from 'zod';

// Common validation patterns
const emailSchema = z.string().email().max(255);
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a number');
const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(255, 'Name must be less than 255 characters')
  .regex(/^[\p{L}\p{N}\s\-_.]+$/u, 'Name contains invalid characters');
const slugSchema = z.string()
  .min(1, 'Slug is required')
  .max(63, 'Slug must be less than 63 characters')
  .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/, 'Slug must be alphanumeric with hyphens')
  .refine(slug => !slug.startsWith('-') && !slug.endsWith('-'), 'Slug cannot start or end with hyphen');

// Auth schemas
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  companyName: nameSchema,
  companySlug: slugSchema
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().max(128)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1)
});

// User schemas
export const inviteUserSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  role: z.enum(['admin', 'member', 'viewer']).default('member')
});

export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  avatar: z.string().url().max(500).optional()
});

// Company schemas
export const updateCompanySchema = z.object({
  name: nameSchema.optional(),
  subdomain: slugSchema.optional(),
  domain: z.string().max(255).refine(
    val => !val || /^[a-zA-Z0-9][a-zA-Z0-9-.]*[a-zA-Z0-9]$/.test(val),
    'Invalid domain format'
  ).optional(),
  logo: z.string().url().max(500).optional()
});

// Sanitize input - remove null/undefined and trim strings
export const sanitizeInput = <T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T> => {
  const parsed = schema.parse(data);
  
  // Deep trim and remove nulls
  const sanitized = JSON.parse(JSON.stringify(parsed), (key: string, value: any) => {
    if (typeof value === 'string') return value.trim();
    if (value === null) return undefined;
    return value;
  });
  
  return schema.parse(sanitized);
};

// Validate and sanitize with error handling
export const validateRequest = <T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: string } => {
  try {
    const sanitized = sanitizeInput(schema, data);
    return { success: true, data: sanitized };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { success: false, error: `${firstError.path.join('.')}: ${firstError.message}` };
    }
    return { success: false, error: 'Invalid request' };
  }
};

export default {
  registerSchema,
  loginSchema,
  refreshSchema,
  inviteUserSchema,
  updateUserSchema,
  updateCompanySchema,
  validateRequest,
  sanitizeInput
};