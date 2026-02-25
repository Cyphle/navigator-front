import { put, deleteOne } from './http';

global.fetch = jest.fn();

describe('http helpers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('put', () => {
    test('makes PUT request with correct parameters', async () => {
      const mockResponse = { id: 1, name: 'Updated' };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const mapper = (data: any) => ({ id: data.id, name: data.name });
      const result = await put('test/1', { name: 'Updated' }, mapper);

      expect(global.fetch).toHaveBeenCalledWith('api/test/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: 'Updated' }),
      });

      expect(result).toEqual({ id: 1, name: 'Updated' });
    });

    test('applies mapper to response', async () => {
      const mockResponse = { id: 1, name: 'Test', extra: 'field' };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const mapper = (data: any) => ({ id: data.id });
      const result = await put('test/1', {}, mapper);

      expect(result).toEqual({ id: 1 });
    });
  });

  describe('deleteOne', () => {
    test('makes DELETE request with 204 response', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 204,
        json: jest.fn(),
      });

      await deleteOne('test/1');

      expect(global.fetch).toHaveBeenCalledWith('api/test/1', {
        method: 'DELETE',
        credentials: 'include',
      });
    });

    test('handles 204 response with mapper', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 204,
        json: jest.fn(),
      });

      const mapper = (data: any) => ({ success: true });
      const result = await deleteOne('test/1', mapper);

      expect(result).toEqual({ success: true });
    });

    test('handles JSON response', async () => {
      const mockResponse = { id: 1, deleted: true };
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const mapper = (data: any) => data;
      const result = await deleteOne('test/1', mapper);

      expect(result).toEqual(mockResponse);
    });

    test('works without mapper', async () => {
      const mockResponse = { id: 1 };
      (global.fetch as jest.Mock).mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await deleteOne('test/1');

      expect(result).toEqual(mockResponse);
    });
  });
});
