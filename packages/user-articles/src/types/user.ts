import { z } from 'zod';
import { userSchema } from '../schemas/request/user';

export type TUser = z.infer<typeof userSchema>;

export type CreateUserInput = {
  user_id: string;
  login: string;
  password: string;
};

export type LoginInput = {
  login: string;
  password: string;
};
