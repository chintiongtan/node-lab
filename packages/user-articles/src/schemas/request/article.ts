import { z } from 'zod';
import { Visibility } from '../../types/article';

export const createArticleRequestSchema = z.object({
  body: z.object({
    article_id: z.string().nonempty(),
    title: z.string().nonempty(),
    content: z.string().nonempty(),
    visibility: z.nativeEnum(Visibility),
  }),
});
