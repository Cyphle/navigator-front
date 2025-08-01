import { mockDatabase } from '../../testing/mock-database';
import { Profile } from '../profile/profile.types';
import { createAccountHandler, getAccountByIdHandler, getAccountsHandler } from './account.handlers';

describe('Account handlers', () => {
  it('should get all account from database', () => {
    const accounts = getAccountsHandler(mockDatabase)({ username: 'john.doe' } as Profile);

    expect(accounts).toHaveLength(3);
  });

  it('should get one account from database for given id', () => {
    const account = getAccountByIdHandler(mockDatabase)(1, { username: 'john.doe' } as Profile);

    expect(account?.id).toEqual(1);
  });

  it('should create an account', () => {
    const account = createAccountHandler(mockDatabase)({ 
      username: 'john.doe',
      name: 'Another account',
      type: 'PERSONAL',
      startingBalance: 1000,
      currentBalance: 1000,
      projectedBalance: 1000
    });

    expect(account.id).toEqual(5);
  });
})