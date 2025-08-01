import fastify from 'fastify';
import { Database } from '../../database/database';
import { Profile } from '../profile/profile.types';
import { Account, AccountView, CreateAccountRequest } from './account.types';

export const getAccountsHandler = (database: Database) => (profile: Profile): AccountView[] => {
  return database.read<Account>('accounts')
    .filter((account: Account) => account.username === profile.username)
    .map((account: Account) => mapAccountToAccountView(account));
}

export const getAccountByIdHandler = (database: Database) => (id: number, profile: Profile): AccountView | undefined => {
  const account = database.readOneById<Account>('accounts', id);

  if (account.username !== profile.username) {
    return undefined;
  } else {
    return mapAccountToAccountView(account);
  }
}

export const createAccountHandler = (database: Database) => (request: CreateAccountRequest): AccountView => {
  const accounts = database.read<Account>('accounts')
    .sort((a: Account, b: Account) => a.id - b.id)
    .reverse();

  const account: Account = {
    id: (accounts[0]?.id ?? 0) + 1,
    username: request.username,
    summary: {
      name: request.name,
      type: request.type,
      startingBalance: request.startingBalance,
      currentBalance: request.currentBalance,
      projectedBalance: request.projectedBalance,
    },
    budgets: [],
    transactions: [],
  }

  const mapped = mapAccountToAccountView(database.create<Account>('accounts', account));

  return mapped;
}

const mapAccountToAccountView = (account: Account): AccountView => {
  return {
    id: account.id,
    summary: account.summary,
    budgets: account.budgets,
    transactions: account.transactions,
  }
}