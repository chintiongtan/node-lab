import { z } from 'zod';
import { Visibility } from '../types/article';

export const createArticleRequestSchema = z.object({
  body: z.object({
    article_id: z.string().nonempty(),
    title: z.string().nonempty(),
    content: z.string().nonempty(),
    visibility: z.nativeEnum(Visibility),
  }),
});

export const createUserRequestSchema = z.object({
  body: z.object({
    login: z.string().nonempty(),
    password: z.string().nonempty(),
    user_id: z.string().nonempty(),
  }),
});

export const createUserSessionRequest = z.object({
  body: z.object({
    token: z.string(),
    user_id: z.string(),
  }),
});

export const loginRequestSchema = z.object({
  body: z.object({
    login: z.string().nonempty(),
    password: z.string().nonempty(),
  }),
});
