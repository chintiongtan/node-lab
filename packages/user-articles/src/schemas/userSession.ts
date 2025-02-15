import { z } from 'zod';

export const userSessionSchema = z.object({
  CreatedAt: z.string().datetime(),
  Token: z.string(),
  UpdatedAt: z.string().datetime(),
  UserId: z.string(),
});
