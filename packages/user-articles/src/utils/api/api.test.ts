import { buildErrorResponse, buildSuccessResponse } from './api';

describe('buildResponse', () => {
  describe('buildErrorResponse', () => {
    test('should build error response with given code and message', () => {
      const response = buildErrorResponse(404, 'Not found');

      expect(response).toStrictEqual({
        error: {
          code: 404,
          message: 'Not found',
        },
        success: false,
      });
    });
  });

  describe('buildSuccessResponse', () => {
    test('should build success response with given data', () => {
      const expectedData = { foo: 'bar' };
      const response =
        buildSuccessResponse<Record<string, string>>(expectedData);

      expect(response).toStrictEqual({
        data: expectedData,
        success: true,
      });
    });
  });
});
