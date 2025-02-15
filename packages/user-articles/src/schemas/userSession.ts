import { z } from 'zod';

export const userSessionSchema = z.object({
  CreatedAt: z.string().datetime(),
  Login: z.string(),
  Token: z.string(),
  UpdatedAt: z.string().datetime(),
});
