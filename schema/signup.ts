import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z
      .string({ required_error: "Prosím zadajte svoju e-mailovú adresu" })
      .email({ message: "Nesprávny formát e-mailu" }),
    password: z
      .string({ required_error: "Prosím zadajte svoje heslo" })
      .min(5, "Minimálna dĺžka hesla je 5 znakov"),
    confirmPassword: z
      .string({ required_error: "Please enter valid password" })
      .min(5, "Minimálna dĺžka hesla je 5 znakov"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Heslá sa musia zhodovať",
    path: ["confirmPassword"], // path of error
  });
