import { z } from 'zod';
import { userSchema } from '../schemas/user';

export type TUser = z.infer<typeof userSchema>;
