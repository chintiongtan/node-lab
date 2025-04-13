import { z } from 'zod';

export const stageSchema = z.enum(['staging', 'production']);
