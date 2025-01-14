import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string({ required_error: 'Please enter your email address' })
    .email({ message: 'Invalid email' }),
  password: z.string({ required_error: 'Please enter valid password' }),
});
