import { Request, Response } from 'express';
import UserSessionRepository from '../../repositories/UserSessionRepository';
import authorized from './authorized';

jest.mock('dynamoose');

describe('authorized', () => {
  const mockedRes = {
    locals: {},
    send: jest.fn(() => mockedRes),
    status: jest.fn(() => mockedRes),
  } as unknown as Response;
  const mockedNext = jest.fn();
  const mockedGetUserSessionByToken = jest.spyOn(
    UserSessionRepository.prototype,
    'getUserSessionByToken',
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should forward request if token is valid', async () => {
    mockedGetUserSessionByToken.mockResolvedValue({
      CreatedAt: '',
      Login: '',
      Token: 'abc123',
      UpdatedAt: '',
      UserId: '000',
    });

    const mockedHeader = jest.fn().mockReturnValue('abc123');
    const mockedReq = { header: mockedHeader } as unknown as Request;

    await authorized()(mockedReq, mockedRes, mockedNext);

    expect(mockedHeader).toHaveBeenCalledWith('Authorization');
    expect(mockedGetUserSessionByToken).toHaveBeenCalledWith('abc123');
    expect(mockedRes.status).not.toHaveBeenCalled();
    expect(mockedRes.send).not.toHaveBeenCalled();
    expect(mockedNext).toHaveBeenCalled();
  });

  test('should forward request if strict mode is disabled', async () => {
    mockedGetUserSessionByToken.mockResolvedValue(undefined);

    const mockedHeader = jest.fn().mockReturnValue('abc123');
    const mockedReq = { header: mockedHeader } as unknown as Request;

    await authorized(false)(mockedReq, mockedRes, mockedNext);

    expect(mockedHeader).toHaveBeenCalledWith('Authorization');
    expect(mockedGetUserSessionByToken).toHaveBeenCalledWith('abc123');
    expect(mockedRes.status).not.toHaveBeenCalled();
    expect(mockedRes.send).not.toHaveBeenCalled();
    expect(mockedNext).toHaveBeenCalled();
  });

  test('should return unauthorized in the absence of bearer token', async () => {
    const mockedHeader = jest.fn().mockReturnValue(undefined);
    const mockedReq = { header: mockedHeader } as unknown as Request;

    await authorized()(mockedReq, mockedRes, mockedNext);

    expect(mockedHeader).toHaveBeenCalledWith('Authorization');
    expect(mockedGetUserSessionByToken).not.toHaveBeenCalled();
    expect(mockedRes.status).toHaveBeenCalledWith(401);
    expect(mockedRes.send).toHaveBeenCalledWith({
      error: { code: 401, message: 'Unauthorized' },
      success: false,
    });
    expect(mockedNext).not.toHaveBeenCalled();
  });

  test('should return unauthorized if token is invalid', async () => {
    mockedGetUserSessionByToken.mockResolvedValue(undefined);

    const mockedHeader = jest.fn().mockReturnValue('abc123');
    const mockedReq = { header: mockedHeader } as unknown as Request;

    await authorized()(mockedReq, mockedRes, mockedNext);

    expect(mockedHeader).toHaveBeenCalledWith('Authorization');
    expect(mockedGetUserSessionByToken).toHaveBeenCalledWith('abc123');
    expect(mockedRes.status).toHaveBeenCalledWith(401);
    expect(mockedRes.send).toHaveBeenCalledWith({
      error: { code: 401, message: 'Unauthorized' },
      success: false,
    });
    expect(mockedNext).not.toHaveBeenCalled();
  });
});
