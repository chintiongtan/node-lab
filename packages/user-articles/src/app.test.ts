import request from 'supertest';
import app from './app';
import UserRepository from './repositories/UserRepository';
import UserSessionRepository from './repositories/UserSessionRepository';

afterEach(() => {
  jest.clearAllMocks();
});

describe('API', () => {
  test('POST /api/user should return 201 after adding new user record', () => {
    const payload = {
      user_id: '10001',
      login: 'username@example.org',
      password: 'abc*123!',
    };
    const mockCreate = jest.spyOn(UserRepository.prototype, 'create');

    mockCreate.mockResolvedValue();

    return request(app)
      .post('/api/user')
      .send(payload)
      .then((response) => {
        expect(mockCreate).toHaveBeenCalledWith(payload);
        expect(response.statusCode).toEqual(201);
      });
  });

  test('POST /api/user should return 400 if body is empty', () => {
    const mockCreate = jest.spyOn(UserRepository.prototype, 'create');

    return request(app)
      .post('/api/user')
      .then((response) => {
        expect(mockCreate).toHaveBeenCalledTimes(0);
        expect(response.statusCode).toEqual(400);
      });
  });

  test('POST /api/auth should return token if user exists', () => {
    const user = {
      CreatedAt: '',
      Login: 'username@example.org',
      Password: 'abc*123!',
      UpdatedAt: '',
      UserId: '10001',
    };
    const mockGetUserByLogin = jest.spyOn(
      UserRepository.prototype,
      'getUserByLogin',
    );

    mockGetUserByLogin.mockResolvedValue(user);

    return request(app)
      .post('/api/auth')
      .send({ login: user.Login, password: user.Password })
      .then((response) => {
        expect(mockGetUserByLogin).toHaveBeenCalledWith(user.Login);
        expect(response.statusCode).toEqual(200);
        expect(response.body.token).toBeDefined();
      });
  });

  test('POST /api/auth should return 400 if body is empty', () => {
    const mockGetUserByLogin = jest.spyOn(
      UserRepository.prototype,
      'getUserByLogin',
    );

    return request(app)
      .post('/api/auth')
      .then((response) => {
        expect(mockGetUserByLogin).toHaveBeenCalledTimes(0);
        expect(response.statusCode).toEqual(400);
      });
  });

  test('POST /api/auth should return 401 if password is incorrect', () => {
    const user = {
      CreatedAt: '',
      Login: 'username@example.org',
      Password: 'abc*123!',
      UpdatedAt: '',
      UserId: '10001',
    };
    const mockGetUserByLogin = jest.spyOn(
      UserRepository.prototype,
      'getUserByLogin',
    );

    mockGetUserByLogin.mockResolvedValue(user);

    return request(app)
      .post('/api/auth')
      .send({ login: user.Login, password: 'def*456!' })
      .then((response) => {
        expect(mockGetUserByLogin).toHaveBeenCalledWith(user.Login);
        expect(response.statusCode).toEqual(401);
      });
  });

  test('POST /api/auth/logout should return 200 if logout successfully', () => {
    const mockGetUserSessionByToken = jest.spyOn(
      UserSessionRepository.prototype,
      'getUserSessionByToken',
    );
    const mockDeleteUserSessionByToken = jest.spyOn(
      UserSessionRepository.prototype,
      'deleteUserSessionByToken',
    );

    mockGetUserSessionByToken.mockReturnValue({
      user_id: '10001',
      token: 'sometoken',
    });

    return request(app)
      .post('/api/auth/logout')
      .set('Authorization', 'Bearer sometoken')
      .then((response) => {
        expect(mockGetUserSessionByToken).toHaveBeenCalledWith('sometoken');
        expect(mockDeleteUserSessionByToken).toHaveBeenCalledWith('sometoken');
        expect(response.statusCode).toEqual(200);
      });
  });

  test('POST /api/auth/logout should return 401 if authentication-header header is not set', () => {
    const mockGetUserSessionByToken = jest.spyOn(
      UserSessionRepository.prototype,
      'getUserSessionByToken',
    );

    return request(app)
      .post('/api/auth/logout')
      .then((response) => {
        expect(mockGetUserSessionByToken).toHaveBeenCalledTimes(0);
        expect(response.statusCode).toEqual(401);
      });
  });

  test('POST /api/auth/logout should return 401 for non-existent token', () => {
    const mockGetUserSessionByToken = jest.spyOn(
      UserSessionRepository.prototype,
      'getUserSessionByToken',
    );

    mockGetUserSessionByToken.mockReturnValue(undefined);

    return request(app)
      .post('/api/auth/logout')
      .set('Authorization', 'Bearer sometoken')
      .then((response) => {
        expect(mockGetUserSessionByToken).toHaveBeenCalledWith('sometoken');
        expect(response.statusCode).toEqual(401);
      });
  });
});
