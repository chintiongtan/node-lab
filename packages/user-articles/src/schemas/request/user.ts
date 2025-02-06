import { z } from 'zod';

export const createUserRequestSchema = z.object({
  body: z.object({
    login: z.string().nonempty(),
    password: z.string().nonempty(),
    user_id: z.string().nonempty(),
  }),
});
