const mockedExec = jest.fn();
const mockedModelCreate = jest.fn();
const mockedModelDelete = jest.fn();
const mockedModelQuery = jest.fn();
const mockedUsing = jest.fn();

import UserSessionRepository from './UserSessionRepository';

jest.mock('dynamoose', () => ({
  model: () => ({
    create: mockedModelCreate,
    delete: mockedModelDelete,
    query: mockedModelQuery,
  }),
  Schema: jest.fn(),
}));

const userSessionRepository = UserSessionRepository.getInstance();

describe('UserSessionRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedModelQuery.mockReturnValue({ using: mockedUsing });
    mockedUsing.mockReturnValue({ exec: mockedExec });
  });

  test('create should add new item to record', async () => {
    const token = 'xyz*123!';
    const user = {
      CreatedAt: '2025-02-14T14:41:07.095Z',
      Login: 'username@example.org',
      Password: 'abc*123!',
      UpdatedAt: '2025-02-14T14:41:07.095Z',
      UserId: '10000',
    };

    await userSessionRepository.create({ token, user });

    expect(mockedModelCreate).toHaveBeenCalledWith({
      Login: user.Login,
      sk: `SESSION#${token}`,
      Token: token,
      UserId: user.UserId,
    });
  });

  test('getUserSessionByToken should return session of matching token', async () => {
    const token = 'xyz*123!';

    mockedExec.mockResolvedValue([
      {
        CreatedAt: '2025-02-14T14:41:07.095Z',
        Login: 'username@example.org',
        Token: token,
        UpdatedAt: '2025-02-14T14:41:07.095Z',
        UserId: '10000',
      },
    ]);

    const userSession =
      await userSessionRepository.getUserSessionByToken(token);

    expect(mockedModelQuery).toHaveBeenCalledWith({ Token: token });
    expect(mockedUsing).toHaveBeenCalledWith('TokenGlobalIndex');
    expect(userSession).toBeDefined();
    expect(userSession?.UserId).toBe('10000');
  });

  test('getUserSessionByToken should return undefined for non-matching token', async () => {
    mockedExec.mockResolvedValue([]);

    const userSession =
      await userSessionRepository.getUserSessionByToken('xyz*123!');

    expect(userSession).toBeUndefined();
  });

  test('deleteUserSessionByToken should not remove session if not exists', async () => {
    mockedExec.mockResolvedValue([]);

    await userSessionRepository.deleteUserSessionByToken('xyz*123!');

    expect(mockedModelDelete).not.toHaveBeenCalled();
  });

  test('deleteUserSessionByToken should remove session if exists', async () => {
    const token = 'xyz*123!';

    mockedExec.mockResolvedValue([
      {
        CreatedAt: '2025-02-14T14:41:07.095Z',
        Login: 'username@example.org',
        Token: token,
        UpdatedAt: '2025-02-14T14:41:07.095Z',
        UserId: '10000',
      },
    ]);

    await userSessionRepository.deleteUserSessionByToken(token);

    expect(mockedModelDelete).toHaveBeenCalledWith({
      Login: 'username@example.org',
      sk: `SESSION#${token}`,
    });
  });
});
