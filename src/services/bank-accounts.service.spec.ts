import { getOne, post } from '../helpers/http';
import {
  getAllBankAccounts,
  getBankAccountById,
  createBankAccount,
  addBudget,
  addBudgetExpense,
  addCharge,
  addCredit,
  addExpense,
} from './bank-accounts.service';

jest.mock('../helpers/http', () => ({
  getOne: jest.fn(),
  post: jest.fn(),
}));

const TEST_FAMILY_ID = '1';

const rawBankAccount = {
  id: 1,
  name: 'Compte courant',
  startingAmount: 1000,
  startDate: '2026-01-01',
  visibility: 'SHARED',
  familyId: 1,
  budgets: [],
  charges: [],
  credits: [],
  expenses: [],
};

const rawBankAccountMonthView = {
  id: 1,
  name: 'Compte courant',
  startingAmount: 1000,
  startDate: '2026-01-01',
  visibility: 'SHARED',
  familyId: 1,
  monthLabel: 'Mars 2026',
  remainingAmount: 500,
  actualAmount: 350,
  budgets: [],
  charges: [],
  credits: [],
  expenses: [],
};

describe('bank-accounts service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAllBankAccounts calls correct endpoint and maps response', async () => {
    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: unknown) => unknown) =>
      Promise.resolve(mapper([rawBankAccount]))
    );

    const result = await getAllBankAccounts(TEST_FAMILY_ID);

    expect(getOne).toHaveBeenCalledWith('families/1/bank-accounts', expect.any(Function));
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Compte courant');
    expect(result[0].startingAmount).toBe(1000);
  });

  test('getBankAccountById calls correct endpoint with year and month params and returns BankAccountMonthView', async () => {
    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: unknown) => unknown) =>
      Promise.resolve(mapper(rawBankAccountMonthView))
    );

    const result = await getBankAccountById(TEST_FAMILY_ID, 1, 2026, 3);

    expect(getOne).toHaveBeenCalledWith(
      'families/1/bank-accounts/1?year=2026&month=3',
      expect.any(Function)
    );
    expect(result.monthLabel).toBe('Mars 2026');
    expect(result.remainingAmount).toBe(500);
    expect(result.actualAmount).toBe(350);
  });

  test('createBankAccount posts to correct endpoint', async () => {
    (post as jest.Mock).mockImplementation((_path: string, _body: unknown, mapper: (data: unknown) => unknown) =>
      Promise.resolve(mapper(rawBankAccount))
    );

    const input = { name: 'Nouveau compte', startingAmount: 500, startDate: '2026-03-01', visibility: 'PERSONAL' as const };
    await createBankAccount(TEST_FAMILY_ID, input);

    expect(post).toHaveBeenCalledWith('families/1/bank-accounts', input, expect.any(Function));
  });

  test('addBudget posts to correct endpoint', async () => {
    (post as jest.Mock).mockImplementation((_path: string, _body: unknown, mapper: (data: unknown) => unknown) =>
      Promise.resolve(mapper(rawBankAccount))
    );

    const input = { name: 'Alimentation', initialAmount: 400 };
    await addBudget(TEST_FAMILY_ID, 1, input);

    expect(post).toHaveBeenCalledWith('families/1/bank-accounts/1/budgets', input, expect.any(Function));
  });

  test('addBudgetExpense posts to correct endpoint', async () => {
    (post as jest.Mock).mockImplementation((_path: string, _body: unknown, mapper: (data: unknown) => unknown) =>
      Promise.resolve(mapper(rawBankAccount))
    );

    const input = { expenseDate: '2026-03-05', debitDate: '2026-03-06', description: 'Courses', amount: 50 };
    await addBudgetExpense(TEST_FAMILY_ID, 1, 2, input);

    expect(post).toHaveBeenCalledWith(
      'families/1/bank-accounts/1/budgets/2/expenses',
      input,
      expect.any(Function)
    );
  });

  test('addCharge posts to correct endpoint', async () => {
    (post as jest.Mock).mockImplementation((_path: string, _body: unknown, mapper: (data: unknown) => unknown) =>
      Promise.resolve(mapper(rawBankAccount))
    );

    const input = { description: 'Loyer', amount: 900, debitDate: '2026-03-01', periodicity: 'MONTHLY' as const };
    await addCharge(TEST_FAMILY_ID, 1, input);

    expect(post).toHaveBeenCalledWith('families/1/bank-accounts/1/charges', input, expect.any(Function));
  });

  test('addCredit posts to correct endpoint', async () => {
    (post as jest.Mock).mockImplementation((_path: string, _body: unknown, mapper: (data: unknown) => unknown) =>
      Promise.resolve(mapper(rawBankAccount))
    );

    const input = { description: 'Salaire', amount: 2500, creditDate: '2026-03-28' };
    await addCredit(TEST_FAMILY_ID, 1, input);

    expect(post).toHaveBeenCalledWith('families/1/bank-accounts/1/credits', input, expect.any(Function));
  });

  test('addExpense posts to correct endpoint', async () => {
    (post as jest.Mock).mockImplementation((_path: string, _body: unknown, mapper: (data: unknown) => unknown) =>
      Promise.resolve(mapper(rawBankAccount))
    );

    const input = { description: 'Restaurant', amount: 45, expenseDate: '2026-03-15', debitDate: '2026-03-16' };
    await addExpense(TEST_FAMILY_ID, 1, input);

    expect(post).toHaveBeenCalledWith('families/1/bank-accounts/1/expenses', input, expect.any(Function));
  });

  test('getBankAccountById handles missing fields gracefully', async () => {
    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: unknown) => unknown) =>
      Promise.resolve(mapper({}))
    );

    const result = await getBankAccountById(TEST_FAMILY_ID, 1, 2026, 3);

    expect(result.id).toBe(0);
    expect(result.name).toBe('');
    expect(result.monthLabel).toBe('');
    expect(result.remainingAmount).toBe(0);
    expect(result.actualAmount).toBe(0);
    expect(result.budgets).toEqual([]);
  });
});
