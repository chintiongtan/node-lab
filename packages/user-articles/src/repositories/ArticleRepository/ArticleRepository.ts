import { TCreateArticleRequest } from '../../types/api';
import { Article, Visibility } from '../../types/article';
import { TUserSession } from '../../types/userSession';

export default class ArticleRepository {
  private static instance: ArticleRepository;

  private records: Array<Article>;

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
      article_id: input.article_id,
      title: input.title,
      content: input.content,
      visibility: input.visibility,
      user_id: userSession.UserId,
    });
  }

  public getPublicArticles(): Array<Article> {
    return this.records.filter(
      (record) => record.visibility === Visibility.PUBLIC,
    );
  }

  public getUserArticles(userId: string): Array<Article> {
    return this.records.filter(
      (record) =>
        record.visibility === Visibility.PUBLIC ||
        record.visibility === Visibility.LOGGED_IN ||
        (record.visibility === Visibility.PRIVATE && record.user_id === userId),
    );
  }
}
