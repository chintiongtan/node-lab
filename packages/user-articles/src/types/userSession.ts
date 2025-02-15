import { z } from 'zod';
import { userSessionSchema } from '../schemas/userSession';

export type TUserSession = z.infer<typeof userSessionSchema>;
