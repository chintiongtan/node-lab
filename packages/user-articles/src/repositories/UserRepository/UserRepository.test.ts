const mockedExec = jest.fn();
const mockedModelCreate = jest.fn();
const mockedModelQuery = jest.fn();

import UserRepository from './UserRepository';

jest.mock('dynamoose', () => ({
  model: () => ({
    create: mockedModelCreate,
    query: mockedModelQuery,
  }),
  Schema: jest.fn(),
  Table: jest.fn(),
}));

const userRepository = UserRepository.getInstance();

describe('UserRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedModelQuery.mockReturnValue({ exec: mockedExec });
  });

  test('create should add a new item to records', async () => {
    const input = {
      user_id: '10000',
      login: 'username@example.org',
      password: 'abc*123!',
    };

    await userRepository.create(input);

    expect(mockedModelCreate).toHaveBeenCalledWith({
      Login: input.login,
      Password: input.password,
      UserId: input.user_id,
    });
  });

  test('getUserByLogin should return user if found', async () => {
    mockedExec.mockResolvedValue([
      {
        CreatedAt: '2025-02-14T14:41:07.095Z',
        Login: 'username@example.org',
        Password: 'abc*123!',
        UpdatedAt: '2025-02-14T14:41:07.095Z',
        UserId: '10000',
      },
    ]);

    const user = await userRepository.getUserByLogin('username@example.org');

    expect(mockedModelQuery).toHaveBeenCalledWith({
      Login: 'username@example.org',
      sk: 'ROOT',
    });
    expect(user).toBeDefined();
    expect(user?.Login).toBe('username@example.org');
  });

  test.each([[[]], [{}]])(
    'getUserByLogin should return undefined if not found',
    async (mockedResult) => {
      mockedExec.mockResolvedValue(mockedResult);

      const user = await userRepository.getUserByLogin('username@example.org');

      expect(mockedModelQuery).toHaveBeenCalledWith({
        Login: 'username@example.org',
        sk: 'ROOT',
      });
      expect(user).toBeUndefined();
    },
  );
});
