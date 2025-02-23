import request from 'supertest';
import app from './app';
import UserRepository from './repositories/UserRepository';
import UserSessionRepository from './repositories/UserSessionRepository';

jest.mock('dynamoose');

describe('API', () => {
  const mockedUserCreate = jest.spyOn(UserRepository.prototype, 'create');
  const mockedUserSessionCreate = jest.spyOn(
    UserSessionRepository.prototype,
    'create',
  );
  const mockedGetUserByLogin = jest.spyOn(
    UserRepository.prototype,
    'getUserByLogin',
  );
  const mockedGetUserSessionByToken = jest.spyOn(
    UserSessionRepository.prototype,
    'getUserSessionByToken',
  );
  const mockedDeleteUserSessionByToken = jest.spyOn(
    UserSessionRepository.prototype,
    'deleteUserSessionByToken',
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/user should return 201 after adding new user record', async () => {
    const payload = {
      user_id: '10001',
      login: 'username@example.org',
      password: 'abc*123!',
    };

    mockedUserCreate.mockResolvedValue();

    return request(app)
      .post('/api/user')
      .send(payload)
      .then((response) => {
        expect(mockedUserCreate).toHaveBeenCalledWith(payload);
        expect(response.statusCode).toEqual(201);
      });
  });

  test('POST /api/user should return 400 if body is empty', async () => {
    return request(app)
      .post('/api/user')
      .then((response) => {
        expect(mockedUserCreate).not.toHaveBeenCalled();
        expect(response.statusCode).toEqual(400);
      });
  });

  test('POST /api/auth should return token if user exists', async () => {
    const user = {
      CreatedAt: '',
      Login: 'username@example.org',
      Password: 'abc*123!',
      UpdatedAt: '',
      UserId: '10001',
    };

    mockedGetUserByLogin.mockResolvedValue(user);
    mockedUserSessionCreate.mockResolvedValue();

    return request(app)
      .post('/api/auth')
      .send({ login: user.Login, password: user.Password })
      .then((response) => {
        expect(mockedGetUserByLogin).toHaveBeenCalledWith(user.Login);
        expect(mockedUserSessionCreate).toHaveBeenCalledWith({
          token: expect.any(String),
          user,
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.token).toBeDefined();
      });
  });

  test('POST /api/auth should return 400 if body is empty', async () => {
    return request(app)
      .post('/api/auth')
      .then((response) => {
        expect(mockedGetUserByLogin).not.toHaveBeenCalled();
        expect(mockedUserSessionCreate).not.toHaveBeenCalled();
        expect(response.statusCode).toEqual(400);
      });
  });

  test('POST /api/auth should return 401 if password is incorrect', async () => {
    const user = {
      CreatedAt: '',
      Login: 'username@example.org',
      Password: 'abc*123!',
      UpdatedAt: '',
      UserId: '10001',
    };

    mockedGetUserByLogin.mockResolvedValue(user);

    return request(app)
      .post('/api/auth')
      .send({ login: user.Login, password: 'def*456!' })
      .then((response) => {
        expect(mockedGetUserByLogin).toHaveBeenCalledWith(user.Login);
        expect(mockedUserSessionCreate).not.toHaveBeenCalled();
        expect(response.statusCode).toEqual(401);
      });
  });

  test('POST /api/auth/logout should return 200 if logout successfully', async () => {
    mockedGetUserSessionByToken.mockResolvedValue({
      CreatedAt: '',
      Login: '',
      Token: 'sometoken',
      UpdatedAt: '',
      UserId: '10001',
    });
    mockedDeleteUserSessionByToken.mockResolvedValue();

    return request(app)
      .post('/api/auth/logout')
      .set('Authorization', 'Bearer sometoken')
      .then((response) => {
        expect(mockedGetUserSessionByToken).toHaveBeenCalledWith('sometoken');
        expect(mockedDeleteUserSessionByToken).toHaveBeenCalledWith(
          'sometoken',
        );
        expect(response.statusCode).toEqual(200);
      });
  });

  test('POST /api/auth/logout should return 401 if authentication-header header is not set', async () => {
    return request(app)
      .post('/api/auth/logout')
      .then((response) => {
        expect(mockedGetUserSessionByToken).not.toHaveBeenCalled();
        expect(response.statusCode).toEqual(401);
      });
  });

  test('POST /api/auth/logout should return 401 for non-existent token', () => {
    mockedGetUserSessionByToken.mockResolvedValue(undefined);

    return request(app)
      .post('/api/auth/logout')
      .set('Authorization', 'Bearer sometoken')
      .then((response) => {
        expect(mockedGetUserSessionByToken).toHaveBeenCalledWith('sometoken');
        expect(response.statusCode).toEqual(401);
      });
  });
});
