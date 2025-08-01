import { getProfileController } from './profile.controller';
import { mockFastify } from '../../testing/mock-fastify';
import { getProfileHandler } from './profile.handlers';

describe('Profile controller', () => {
  test('should get a profile', (done) => {
    mockFastify({}, [getProfileController(getProfileHandler)])
      .inject()
      .get('/')
      .end((err, res) => {
        expect(res?.statusCode).toEqual(200);
        expect(JSON.parse(res?.body ?? '{}')).toEqual({ profile: { id: 1, username: 'john.doe', firstName: 'John', lastName: 'Doe', email: 'john.doe@banana.fr' } });
        done();
      });
  });
});
