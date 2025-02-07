import { TErrorResponse, TResponse } from '../../types/api';

export const buildErrorResponse = (
  code: number,
  message: string,
): TErrorResponse => ({
  error: {
    code,
    message,
  },
  success: false,
});

export const buildSuccessResponse = <T>(data: T): TResponse<T> => ({
  data,
  success: true,
});
