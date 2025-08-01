import { post } from '../helpers/http';
import { LoginRequest } from '../stores/login/login.types';
import { login, responseToLogin } from './login.service';

jest.mock('../helpers/http', () => ({
  post: jest.fn(),
}));

describe('Login service', () => {
  describe('login', () => {
    it('should call post with correct parameters and return user data', async () => {
      const mockUserResponse = {
        id: 1,
        username: 'john.doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      (post as jest.Mock).mockResolvedValue(mockUserResponse);

      const credentials: LoginRequest = { username: 'john@example.com', password: 'password123' };
      const result = await login(credentials);

      expect(post).toHaveBeenCalledWith('login', credentials, responseToLogin);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('responseToUser', () => {
    it('should map response to user object', () => {
      const mockResponse = {
        profile: {
          id: 1,
          username: 'john.doe',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        }
      };

      const result = responseToLogin(mockResponse);

      expect(result).toEqual({
        username: 'john.doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      });
      expect(result).not.toHaveProperty('someExtraField');
    });
  });
});
