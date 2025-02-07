import { NextFunction, Request, Response } from 'express';
import UserSessionRepository from '../../repositories/UserSessionRepository';
import { buildErrorResponse } from '../../utils/api';

const userSessionRepository = UserSessionRepository.getInstance();

const authorized = async (req: Request, res: Response, next: NextFunction) => {
  const unauthorized = () => {
    res.status(401).send(buildErrorResponse(401, 'Unauthorized'));
    return;
  };

  const bearerToken = req.header('authorization');

  if (!bearerToken) {
    return unauthorized();
  }

  const token = userSessionRepository.getUserSessionByToken(
    bearerToken.replace('Bearer ', ''),
  );

  if (!token) {
    return unauthorized();
  }

  next();
};

export default authorized;
