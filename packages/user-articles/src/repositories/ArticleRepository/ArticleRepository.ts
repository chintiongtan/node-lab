import { z } from 'zod';
import { ArticleModel } from '../../models/article';
import { articleSchema, Visibility } from '../../schemas/article';
import { TCreateArticleRequest } from '../../types/api';
import { TArticle } from '../../types/article';
import { TUserSession } from '../../types/userSession';
import { DynamoDbRepository } from '../DynamoDbRepository';
import * as dynamoose from 'dynamoose';

export default class ArticleRepository extends DynamoDbRepository {
  private static instance: ArticleRepository;

  public static getInstance(): ArticleRepository {
    if (!ArticleRepository.instance) {
      ArticleRepository.instance = new ArticleRepository(ArticleModel);
    }

    return ArticleRepository.instance;
  }

  public async create(
    input: TCreateArticleRequest['body'],
    userSession: TUserSession,
  ): Promise<void> {
    await this.model.create({
      Login: userSession.Login,
      sk: `ARTICLE#${input.article_id}`,
      ArticleId: input.article_id,
      Title: input.title,
      Content: input.content,
      UserId: userSession.UserId,
      Visibility: input.visibility,
    });
  }

  public async getPublicArticles(): Promise<Array<TArticle> | undefined> {
    const result = await this.model
      .query({ Visibility: Visibility.PUBLIC })
      .using('VisibilityGlobalIndex')
      .exec();

    if (!result.length) {
      return undefined;
    }

    const { data = [] } = z.array(articleSchema).safeParse(result);

    return data;
  }

  public async getUserArticles(
    userSession: TUserSession,
  ): Promise<Array<TArticle> | undefined> {
    const result = await this.model
      .query(
        new dynamoose.Condition()
          .where('pk')
          .eq(userSession.Login)
          .filter('sk')
          .beginsWith('ARTICLE'),
      )
      .exec();

    if (!result.length) {
      return undefined;
    }

    const { data = [] } = z.array(articleSchema).safeParse(result);

    return data;
  }
}
