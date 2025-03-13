import { z } from 'zod';
import { articleSchema } from '../schemas/article';

export type TArticle = z.infer<typeof articleSchema>;
