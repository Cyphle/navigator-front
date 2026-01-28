import { post } from '../helpers/http';
import { CreateProfileRequest } from '../stores/profile/profile.types';
import { createProfile, responseToProfile } from './profile.service';

jest.mock('../helpers/http', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('Profile service', () => {
  describe('createProfile', () => {
    it('should call post with correct parameters and return profile data', async () => {
      const mockProfileResponse = {
        username: 'jane.doe',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
      };

      (post as jest.Mock).mockResolvedValue(mockProfileResponse);

      const createProfileRequest: CreateProfileRequest = {
        username: 'jane.doe',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
      };
      const result = await createProfile(createProfileRequest);

      expect(post).toHaveBeenCalledWith('register', createProfileRequest, responseToProfile);
      expect(result).toEqual(mockProfileResponse);
    });
  });

  describe('responseToProfile', () => {
    it('should map response to profile object', () => {
      const mockResponse = {
        username: 'john.doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };

      const result = responseToProfile(mockResponse);

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
