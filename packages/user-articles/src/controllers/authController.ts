import { Request, Response } from 'express';
import UserRepository from '../repositories/UserRepository';
import { v4 as uuidv4 } from 'uuid';
import UserSessionRepository from '../repositories/UserSessionRepository';
import { TLoginRequest } from '../types/api';

const userRepository = UserRepository.getInstance();
const userSessionRepository = UserSessionRepository.getInstance();

export async function login(
  req: Request<unknown, TLoginRequest['body']>,
  res: Response,
) {
  const { login, password } = req.body;
  const user = await userRepository.getUserByLogin(login);

  if (!user) {
    res.status(404).end();
    return;
  }

  if (user.Password !== password) {
    res.status(401).end();
    return;
  }

  const token = uuidv4();

  userSessionRepository.create({ user_id: user.UserId, token });

  res.status(200).json({ token });
}

export function logout(req: Request, res: Response) {
  userSessionRepository.deleteUserSessionByToken(res.locals.token);

  res.status(200).end();
}
