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

  test('should redirect when redirectTo is provided', (done) => {
    mockFastify({}, [loginController(loginHandler)])
      .inject()
      .post('/')
      .body({
        username: 'john.doe',
        password: 'passpass',
        redirectTo: 'http://localhost:5173/registration',
      })
      .end((err, res) => {
        expect(res?.statusCode).toEqual(302);
        expect(res?.headers.location).toEqual('http://localhost:5173/registration');
        done();
      });
  });
});
