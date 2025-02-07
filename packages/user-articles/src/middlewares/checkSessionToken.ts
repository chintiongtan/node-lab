import { NextFunction, Request, Response } from 'express';
import { HEADER_AUTH } from '../utils/constants';
import UserSessionRepository from '../repositories/UserSessionRepository';

const userSessionRepository = UserSessionRepository.getInstance();

export default function checkSessionToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const unauthorised = () => {
    res.status(401).end();
    return;
  };

  const authToken = req.get(HEADER_AUTH);

  if (!authToken) {
    return unauthorised();
  }

  const token = userSessionRepository.getUserSessionByToken(authToken);

  if (!token) {
    return unauthorised();
  }

  next();
}
