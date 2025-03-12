import { z } from "zod";

export const forgottenPasswordSchema = z.object({
  email: z
    .string({ required_error: "Prosím zadajte svoju e-mailovú adresu" })
    .email({ message: "Nesprávny formát e-mailu" }),
});
