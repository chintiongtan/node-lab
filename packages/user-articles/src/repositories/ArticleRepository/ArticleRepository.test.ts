const mockedBeginsWith = jest.fn();
const mockedCondition = jest.fn();
const mockedEq = jest.fn();
const mockedExec = jest.fn();
const mockedFilter = jest.fn();
const mockedModelCreate = jest.fn();
const mockedModelQuery = jest.fn();
const mockedUsing = jest.fn();
const mockedWhere = jest.fn();

import ArticleRepository from './ArticleRepository';
import { Visibility } from '../../schemas/article';

jest.mock('dynamoose', () => ({
  Condition: mockedCondition,
  model: () => ({
    create: mockedModelCreate,
    query: mockedModelQuery,
  }),
  Schema: jest.fn(),
  Table: jest.fn(),
}));

const article = {
  article_id: '10001',
  content: 'Article #1 content',
  title: 'Article #1',
  visibility: Visibility.PRIVATE,
};
const userSession = {
  CreatedAt: '',
  Login: 'john.doe',
  Token: 'secret',
  UpdatedAt: '',
  UserId: '10001',
};
const articleRepository = ArticleRepository.getInstance();

describe('ArticleRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedCondition.mockReturnValue({
      where: mockedWhere.mockReturnValue({
        eq: mockedEq.mockReturnValue({
          filter: mockedFilter.mockReturnValue({
            beginsWith: mockedBeginsWith,
          }),
        }),
      }),
    });
    mockedModelQuery.mockReturnValue({ exec: mockedExec, using: mockedUsing });
    mockedUsing.mockReturnValue({ exec: mockedExec });
  });

  test('create should add a new item to record', async () => {
    await articleRepository.create(article, userSession);

    expect(mockedModelCreate).toHaveBeenCalledWith({
      ArticleId: article.article_id,
      Content: article.content,
      Login: userSession.Login,
      Title: article.title,
      UserId: userSession.UserId,
      Visibility: article.visibility,
      sk: `ARTICLE#${article.article_id}`,
    });
  });

  test('getPublicArticles should return articles with PUBLIC type visibility', async () => {
    mockedExec.mockResolvedValue([
      {
        ArticleId: article.article_id,
        Content: article.content,
        CreatedAt: '2025-02-14T14:41:07.095Z',
        Login: userSession.Login,
        Title: article.title,
        UpdatedAt: '2025-02-14T14:41:07.095Z',
        UserId: userSession.UserId,
        Visibility: article.visibility,
        sk: `ARTICLE#${article.article_id}`,
      },
    ]);

    const result = await articleRepository.getPublicArticles();

    expect(mockedModelQuery).toHaveBeenCalledWith({
      Visibility: Visibility.PUBLIC,
    });
    expect(mockedUsing).toHaveBeenCalledWith('VisibilityGlobalIndex');
    expect(result).toHaveLength(1);
  });

  test('getUserArticles should return all user accessible articles', async () => {
    mockedExec.mockResolvedValue([
      {
        ArticleId: article.article_id,
        Content: article.content,
        CreatedAt: '2025-02-14T14:41:07.095Z',
        Login: userSession.Login,
        Title: article.title,
        UpdatedAt: '2025-02-14T14:41:07.095Z',
        UserId: userSession.UserId,
        Visibility: article.visibility,
        sk: `ARTICLE#${article.article_id}`,
      },
    ]);

    await articleRepository.getUserArticles(userSession);

    const result = await articleRepository.getPublicArticles();

    expect(mockedModelQuery).toHaveBeenCalled();
    expect(mockedCondition).toHaveBeenCalled();
    expect(mockedWhere).toHaveBeenCalledWith('pk');
    expect(mockedEq).toHaveBeenCalledWith(userSession.Login);
    expect(mockedFilter).toHaveBeenCalledWith('sk');
    expect(mockedBeginsWith).toHaveBeenCalledWith('ARTICLE');
    expect(mockedUsing).toHaveBeenCalledWith('VisibilityGlobalIndex');
    expect(result).toHaveLength(1);
  });
});
