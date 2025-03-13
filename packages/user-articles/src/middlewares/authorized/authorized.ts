import { NextFunction, Request, Response } from 'express';
import UserSessionRepository from '../../repositories/UserSessionRepository';
import { buildErrorResponse } from '../../utils/api';

const userSessionRepository = UserSessionRepository.getInstance();

const authorized =
  (strict = true) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const unauthorized = () => {
      if (strict) {
        res.status(401).send(buildErrorResponse(401, 'Unauthorized'));
      } else {
        next();
      }

      return;
    };

    const bearerToken = req.header('Authorization');

    if (!bearerToken) {
      return unauthorized();
    }

    const token = bearerToken.replace('Bearer ', '');
    const userSession =
      await userSessionRepository.getUserSessionByToken(token);

    if (!userSession) {
      return unauthorized();
    }

    res.locals.token = token;

    next();
  };

export default authorized;
