import { mockFastify } from '../../testing/mock-fastify';
import { createAccountController, getAccountByIdController, listAccountsController } from './account.controller';
import { createAccountHandler, getAccountByIdHandler, getAccountsHandler } from './account.handlers';

describe('Account controller', () => {
  test('should get all accounts', done => {
    mockFastify({}, [listAccountsController(getAccountsHandler)])
      .inject()
      .get('/')
      .end((err, res) => {
        expect(res?.statusCode).toEqual(200);
        expect(JSON.parse(res?.body ?? '{}')).toHaveLength(3);
        done();
      });
  });

  test('should get account for given id', done => {
    mockFastify({}, [getAccountByIdController(getAccountByIdHandler)])
      .inject()
      .get('/1')
      .end((err, res) => {
        expect(res?.statusCode).toEqual(200);
        expect(JSON.parse(res?.body ?? '{}').id).toEqual(1);
        done();
      });
  });

  test('should get create an account', done => {
    mockFastify({}, [createAccountController(createAccountHandler)])
      .inject()
      .post('/')
      .body({ name: 'Another account' })
      .end((err, res) => {
        expect(res?.statusCode).toEqual(200);
        expect(JSON.parse(res?.body ?? '{}')).toEqual({ id: 5, summary: { name: 'Another account' }, budgets: [], transactions: [] });
        done();
      });
  });
});
