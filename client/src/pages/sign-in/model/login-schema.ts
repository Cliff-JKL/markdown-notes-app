import { z } from 'zod';

export const loginData = z.object({
  email: z.string().min(1, { message: 'Please enter email' }).email(),
  password: z.string().min(1, { message: 'Please enter password' }).min(12),
});
