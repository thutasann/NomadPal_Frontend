import { z } from 'zod';

// User registration validation schema
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(128, 'Display name must be less than 128 characters')
    .optional(),
  language: z
    .string()
    .optional(),
  origin: z
    .string()
    .optional(),
  passport: z
    .string()
    .optional(),
  timezone: z
    .string()
    .optional(),
  jobTitle: z
    .string()
    .optional(),
  climate: z
    .enum(['Warm', 'Temperate', 'Cold'], {
      errorMap: () => ({ message: 'Please select a valid climate preference' })
    }),
  net: z
    .enum(['Low', 'Medium', 'High'], {
      errorMap: () => ({ message: 'Please select a valid internet speed requirement' })
    }),
  lifestyle: z
    .array(z.string())
    .min(0, 'Please select at least one lifestyle priority')
    .max(6, 'You can select up to 6 lifestyle priorities'),
  budgetMin: z
    .number()
    .min(500, 'Minimum budget must be at least $500')
    .max(10000, 'Minimum budget cannot exceed $10,000'),
  budgetMax: z
    .number()
    .min(600, 'Maximum budget must be at least $600')
    .max(10000, 'Maximum budget cannot exceed $10,000'),
  agreeTos: z
    .boolean()
    .refine(val => val === true, 'You must agree to the Terms of Service'),
  agreeData: z
    .boolean()
    .optional()
}).refine((data) => data.budgetMax > data.budgetMin, {
  message: "Maximum budget must be greater than minimum budget",
  path: ["budgetMax"]
});

// User login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
});
