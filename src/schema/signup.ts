import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z
      .string({ required_error: 'Prosím zadajte svoju e-mailovú adresu' })
      .email({ message: 'Nesprávny formát e-mailu' }),
    password: z
      .string({ required_error: 'Prosím zadajte svoje heslo' })
      .min(8, 'Minimálna dĺžka hesla je 8 znakov')
      .max(128, 'Maximálna dĺžka hesla je 128 znakov'),
    confirmPassword: z
      .string({ required_error: 'Prosím zopakujte heslo' })
      .min(8, 'Minimálna dĺžka hesla je 8 znakov')
      .max(128, 'Maximálna dĺžka hesla je 128 znakov'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Heslá sa musia zhodovať',
    path: ['confirmPassword'],
  });
