import { Request, Response } from 'express';
import UserSessionRepository from '../repositories/UserSessionRepository';
import ArticleRepository from '../repositories/ArticleRepository';
import { TCreateArticleRequest } from '../types/api';

const userSessionRepository = UserSessionRepository.getInstance();
const articleRepository = ArticleRepository.getInstance();

export async function create(
  req: Request<unknown, TCreateArticleRequest['body']>,
  res: Response,
) {
  const { article_id, title, content, visibility } = req.body;
  const userSession = await userSessionRepository.getUserSessionByToken(
    res.locals.token,
  );

  if (!userSession) {
    res.status(401).end();
    return;
  }

  articleRepository.create(
    { article_id, title, content, visibility },
    userSession,
  );

  res.status(201).end();
}

export async function list(req: Request, res: Response) {
  const getPublicArticles = async () => {
    res.status(200).json(await articleRepository.getPublicArticles());
    return;
  };

  const authToken = res.locals.token;

  if (!authToken) {
    return getPublicArticles();
  }

  const userSession =
    await userSessionRepository.getUserSessionByToken(authToken);

  if (!userSession) {
    return getPublicArticles();
  }

  res.status(200).json(await articleRepository.getUserArticles(userSession));
}
