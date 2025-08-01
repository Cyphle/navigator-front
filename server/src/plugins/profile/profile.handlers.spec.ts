import { getProfileHandler } from './profile.handlers';
import { mockDatabase } from '../../testing/mock-database';

describe('Profile handlers', () => {
  test('should get a profile', () => {
    const profile = getProfileHandler(mockDatabase);

    expect(profile).toEqual({ id: 1, username: 'john.doe', firstName: 'John', lastName: 'Doe', email: 'john.doe@banana.fr' });
  });
});