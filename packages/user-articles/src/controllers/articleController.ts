import { Request, Response } from 'express';
import UserSessionRepository from '../repositories/UserSessionRepository';
import ArticleRepository from '../repositories/ArticleRepository';
import { CreateArticleInput } from '../types/article';
import { HEADER_AUTH } from '../utils/constants';
import { UserSession } from '../types/userSession';

const userSessionRepository = UserSessionRepository.getInstance();
const articleRepository = ArticleRepository.getInstance();

export function create(req: Request, res: Response) {
  const { article_id, title, content, visibility } = req.body as CreateArticleInput;
  const userSession = userSessionRepository.getUserSessionByToken(req.get(HEADER_AUTH) as string) as UserSession;

  articleRepository.create({ article_id, title, content, visibility }, userSession);

  res.status(201).end();
}

export function list(req: Request, res: Response) {
  const authToken = req.get(HEADER_AUTH);

  if (!authToken || !userSessionRepository.getUserSessionByToken(authToken)) {
    res.status(200).json(articleRepository.getPublicArticles());
    return;
  }

  const userSession = userSessionRepository.getUserSessionByToken(authToken) as UserSession;

  res.status(200).json(articleRepository.getUserArticles(userSession.user_id));
}
