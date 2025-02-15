import { z } from 'zod';

export const createUserRequestSchema = z.object({
  body: z.object({
    login: z.string().nonempty(),
    password: z.string().nonempty(),
    user_id: z.string().nonempty(),
  }),
});

export const userSchema = z.object({
  CreatedAt: z.string(),
  Login: z.string(),
  Password: z.string(),
  UpdatedAt: z.string(),
  UserId: z.string(),
});
