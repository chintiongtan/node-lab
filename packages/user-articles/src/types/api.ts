import { ZodIssue } from 'zod';

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
