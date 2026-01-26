import { z } from 'zod';

export const customerSchema = z.object({
  business_id: z.string().min(1, 'Business is required'),
  name: z.string().min(1, 'Name is required'),
  phone_number: z
    .string()
    .min(1, 'Phone number is required')
    .refine((val) => /^\d{10}$/.test(val), {
      message: 'Phone number must be exactly 10 digits',
    }),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

export const vehicleSchema = z.object({
  customer_id: z.any().refine((val) => !!val, {
    message: 'Customer is required',
  }),
  vehicle_type: z.string().min(1, 'Vehicle type is required'),
  brand: z.string().min(1, 'Brand is required'),
  vehicle_model: z.string().min(1, 'Model is required'),
  registration_number: z.string().min(1, 'Registration number is required'),
  year: z
    .number({ invalid_type_error: 'Year is required' })
    .min(1900)
    .max(new Date().getFullYear() + 1),
  daily_travel: z.number({ invalid_type_error: 'Daily travel is required' }).min(0),
  service_date: z.any().optional(),
});
