import { Request, Response } from 'express';
import { LoginInput, User } from '../types/user';
import UserRepository from '../repositories/UserRepository';
import { v4 as uuidv4 } from 'uuid';
import UserSessionRepository from '../repositories/UserSessionRepository';
import { HEADER_AUTH } from '../utils/constants';

const userRepository = UserRepository.getInstance();
const userSessionRepository = UserSessionRepository.getInstance();

export function login(req: Request, res: Response) {
  const { login, password } = req.body as LoginInput;
  const user = userRepository.getUserByLogin(login);

  if (!user) {
    res.status(404).end();
    return;
  }

  if ((user as User).password !== password) {
    res.status(401).end();
    return;
  }

  const token = uuidv4();

  userSessionRepository.create({ user_id: (user as User).user_id, token });

  res.status(200).json({ token });
}

export function logout(req: Request, res: Response) {
  userSessionRepository.deleteUserSessionByToken(req.get(HEADER_AUTH) as string);

  res.status(200).end();
}
