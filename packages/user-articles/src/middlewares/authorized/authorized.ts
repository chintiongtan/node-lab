import { NextFunction, Request, Response } from 'express';
import UserSessionRepository from '../../repositories/UserSessionRepository';
import { buildErrorResponse } from '../../utils/api';

const userSessionRepository = UserSessionRepository.getInstance();

const authorized = async (req: Request, res: Response, next: NextFunction) => {
  const unauthorized = () => {
    res.status(401).send(buildErrorResponse(401, 'Unauthorized'));
    return;
  };

  const bearerToken = req.header('Authorization');

  if (!bearerToken) {
    return unauthorized();
  }

  const token = bearerToken.replace('Bearer ', '');
  const userSession = userSessionRepository.getUserSessionByToken(token);

  if (!userSession) {
    return unauthorized();
  }

  res.locals.token = token;

  next();
};

export default authorized;
