import { z, ZodIssue } from 'zod';
import validateSchema from './validateSchema';
import { Request, Response } from 'express';

const schema = z.object({
  body: z.object({ foo: z.string() }),
  params: z.object({ foo: z.string() }),
  query: z.object({ foo: z.string() }),
});
const validate = validateSchema(schema);

describe('validateSchema', () => {
  const mockedRes = { send: jest.fn(() => mockedRes), status: jest.fn(() => mockedRes) } as unknown as Response;
  const mockedNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should forward request if validation passes', async () => {
    const mockedReq = { body: { foo: 'bar' }, params: { foo: 'bar' }, query: { foo: 'bar' } } as unknown as Request;

    await validate(mockedReq, mockedRes, mockedNext);

    expect(mockedNext).toHaveBeenCalled();
  });

  test('should return error if validation failes', async () => {
    const mockedReq = { body: {}, params: {}, query: {} } as unknown as Request;

    await validate(mockedReq, mockedRes, mockedNext);

    expect(mockedNext).not.toHaveBeenCalled();
    expect(mockedRes.status).toHaveBeenCalledWith(400);
    expect(mockedRes.send).toHaveBeenCalledWith({
      error: {
        code: 400,
        message: 'Invalid body, query or params',
        zodErrors: expect.any(Array<ZodIssue>),
      },
      success: false,
    });
  });
});
