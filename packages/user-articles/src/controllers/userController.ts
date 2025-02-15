import { Request, Response } from 'express';
import { CreateUserInput } from '../types/user';
import UserRepository from '../repositories/UserRepository';

const userRepository = UserRepository.getInstance();

export async function create(req: Request, res: Response) {
  const { user_id, login, password } = req.body as CreateUserInput;

  await userRepository.create({ user_id, login, password });

  res.status(201).end();
}
