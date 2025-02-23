import { z } from 'zod';

export const userSchema = z.object({
  CreatedAt: z.string().datetime(),
  Login: z.string(),
  Password: z.string(),
  UpdatedAt: z.string().datetime(),
  UserId: z.string(),
});
