import { Request, Response } from 'express';
import UserRepository from '../repositories/UserRepository';
import { TCreateUserRequest } from '../types/api';

const userRepository = UserRepository.getInstance();

export async function create(
  req: Request<unknown, TCreateUserRequest['body']>,
  res: Response,
) {
  const { user_id, login, password } = req.body;

  await userRepository.create({ user_id, login, password });

  res.status(201).end();
}
