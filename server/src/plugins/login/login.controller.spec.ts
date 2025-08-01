import { mockFastify } from '../../testing/mock-fastify';
import { loginController } from './login.controller';
import { loginHandler } from './login.handler';

describe('Login controller', () => {
  test('should login', (done) => {
    mockFastify({}, [loginController(loginHandler)])
      .inject()
      .post('/')
      .body({
        username: 'john.doe',
        password: 'passpass',
      })
      .end((err, res) => {
        expect(res?.statusCode).toEqual(201);
        done();
      });
  });
});