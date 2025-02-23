import { z, ZodIssue } from 'zod';
import {
  createArticleRequestSchema,
  createUserRequestSchema,
  createUserSessionRequest,
  loginRequestSchema,
} from '../schemas/api';

export type TCreateArticleRequest = z.infer<typeof createArticleRequestSchema>;

export type TCreateUserRequest = z.infer<typeof createUserRequestSchema>;

export type TCreateUserSessionRequest = z.infer<
  typeof createUserSessionRequest
>;

export type TLoginRequest = z.infer<typeof loginRequestSchema>;

export type TResponse<T> = {
  data?: T;
  error?: {
    code: number;
    message: string;
  };
  success: boolean;
};

export type TErrorResponse = TResponse<null> & {
  error: {
    code: number;
    message: string;
  };
};

export type TZodErrorResponse = TErrorResponse & {
  error: {
    code: number;
    message: string;
    zodErrors?: ZodIssue[];
  };
};
