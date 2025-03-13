import { z } from 'zod';

export enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  LOGGED_IN = 'logged_in',
}

export const articleSchema = z.object({
  ArticleId: z.string(),
  Content: z.string(),
  CreatedAt: z.string().datetime(),
  Login: z.string(),
  Title: z.string(),
  UpdatedAt: z.string().datetime(),
  UserId: z.string(),
  Visibility: z.nativeEnum(Visibility),
});
