import { z } from "zod";

export const SignUpSchema = z.object({
  fullName: z.string().min(3).max(255),
  email: z.string().email(),
  universityId: z.coerce.number().positive(),
  universityCard: z.string().nonempty("University Card is required"),
  password: z.string().min(6),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
