import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  phoneNumber: z.string().optional().or(z.literal(''))
});

export const matchSchema = z.object({
  sport: z.enum(['Futsal', 'Cricket', 'Basketball', 'Badminton']),
  location: z.string().min(3, 'Provide a clear location description'),
  dateTime: z.string().datetime(),
  playersNeeded: z.coerce.number().min(2).max(50),
  teamFilings: z.string().min(5, 'Team filings must be at least 5 characters'),
  organizerPhone: z.string().min(10, 'Provide a valid phone number'),
  notes: z.string().optional()
});

export const messageSchema = z.object({
  text: z.string().min(1, 'Message cannot be empty').max(500, 'Message is too long')
});

export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      errors: error.errors?.map(err => ({
        field: err.path?.[0],
        message: err.message
      }))
    });
  }
};