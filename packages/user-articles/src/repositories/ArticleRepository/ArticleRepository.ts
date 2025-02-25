import { Visibility } from '../../schemas/article';
import { TCreateArticleRequest } from '../../types/api';
import { TArticle } from '../../types/article';
import { TUserSession } from '../../types/userSession';

export default class ArticleRepository {
  private static instance: ArticleRepository;

  private records: Array<TArticle>;

  private constructor() {
    this.records = [];
  }

  public static getInstance(): ArticleRepository {
    if (!ArticleRepository.instance) {
      ArticleRepository.instance = new ArticleRepository();
    }

    return ArticleRepository.instance;
  }

  public create(
    input: TCreateArticleRequest['body'],
    userSession: TUserSession,
  ): void {
    this.records.push({
      ArticleId: input.article_id,
      CreatedAt: '',
      Title: input.title,
      Content: input.content,
      Visibility: input.visibility,
      UpdatedAt: '',
      UserId: userSession.UserId,
    });
  }

  public getPublicArticles(): Array<TArticle> {
    return this.records.filter(
      (record) => record.Visibility === Visibility.PUBLIC,
    );
  }

  public getUserArticles(userId: string): Array<TArticle> {
    return this.records.filter(
      (record) =>
        record.Visibility === Visibility.PUBLIC ||
        record.Visibility === Visibility.LOGGED_IN ||
        (record.Visibility === Visibility.PRIVATE && record.UserId === userId),
    );
  }
}
