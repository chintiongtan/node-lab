import { Handler, NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { TZodErrorResponse } from '../../types/api';
import { api } from '../../utils';

const validateSchema =
  (schema: AnyZodObject): Handler =>
  async (
    req: Request,
    res: Response<TZodErrorResponse>,
    next: NextFunction,
  ) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error) {
      const response = api.buildErrorResponse(
        400,
        'Invalid body, query or params',
      );

      res.status(400).send({
        ...response,
        error: {
          ...response.error,
          ...(error instanceof ZodError && { zodErrors: error.issues }),
        },
      });
    }
  };

export default validateSchema;
