import { z } from 'zod';

export const loginRequestSchema = z.object({
  body: z.object({
    login: z.string().nonempty(),
    password: z.string().nonempty(),
  }),
});
