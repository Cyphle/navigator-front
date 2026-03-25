import { waitFor } from '@testing-library/react';
import { renderQueryHook, renderMutateHook, TEST_FAMILY_ID } from '../../../test-utils/render';
import { aBankAccountMonthView } from '../../../test-utils/factories';
import * as bankAccountsService from '../../services/bank-accounts.service';
import {
  useFetchAllBankAccounts,
  useFetchBankAccountById,
  useCreateBankAccount,
  useAddBudget,
  useAddBudgetExpense,
  useAddCharge,
  useAddCredit,
  useAddExpense,
} from './bank-accounts.queries';

jest.mock('../../services/bank-accounts.service', () => ({
  getAllBankAccounts: jest.fn(),
  getBankAccountById: jest.fn(),
  createBankAccount: jest.fn(),
  addBudget: jest.fn(),
  addBudgetExpense: jest.fn(),
  addCharge: jest.fn(),
  addCredit: jest.fn(),
  addExpense: jest.fn(),
}));

describe('bank-accounts queries', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('useFetchAllBankAccounts fetches accounts for current family', async () => {
    const mockAccounts = [aBankAccountMonthView({ id: 1 })];
    jest.mocked(bankAccountsService.getAllBankAccounts).mockResolvedValue(mockAccounts as never);

    const { result } = renderQueryHook(() => useFetchAllBankAccounts());

    expect(bankAccountsService.getAllBankAccounts).toHaveBeenCalledWith(TEST_FAMILY_ID);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockAccounts);
  });

  test('useFetchBankAccountById fetches a specific account for a given month', async () => {
    const mockAccount = aBankAccountMonthView({ id: 1 });
    jest.mocked(bankAccountsService.getBankAccountById).mockResolvedValue(mockAccount);

    const { result } = renderQueryHook(() => useFetchBankAccountById(1, 2026, 3));

    expect(bankAccountsService.getBankAccountById).toHaveBeenCalledWith(TEST_FAMILY_ID, 1, 2026, 3);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockAccount);
  });

  test('useFetchBankAccountById is disabled when id is 0', () => {
    const { result } = renderQueryHook(() => useFetchBankAccountById(0, 2026, 3));

    expect(bankAccountsService.getBankAccountById).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe('idle');
  });

  test('useCreateBankAccount calls service and invalidates queries', async () => {
    const mockAccount = aBankAccountMonthView({ id: 2, name: 'Nouveau compte' });
    jest.mocked(bankAccountsService.createBankAccount).mockResolvedValue(mockAccount as never);

    const { result } = renderMutateHook(() => useCreateBankAccount());
    result.current.mutate({ name: 'Nouveau compte', startingAmount: 500, startDate: '2026-03-01', visibility: 'PERSONAL' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(bankAccountsService.createBankAccount).toHaveBeenCalledWith(
      TEST_FAMILY_ID,
      { name: 'Nouveau compte', startingAmount: 500, startDate: '2026-03-01', visibility: 'PERSONAL' }
    );
  });

  test('useAddBudget calls service with accountId and input', async () => {
    const mockAccount = aBankAccountMonthView({ id: 1 });
    jest.mocked(bankAccountsService.addBudget).mockResolvedValue(mockAccount as never);

    const { result } = renderMutateHook(() => useAddBudget());
    result.current.mutate({ accountId: 1, input: { name: 'Alimentation', initialAmount: 400 } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(bankAccountsService.addBudget).toHaveBeenCalledWith(
      TEST_FAMILY_ID, 1, { name: 'Alimentation', initialAmount: 400 }
    );
  });

  test('useAddBudgetExpense calls service with accountId, budgetId and input', async () => {
    const mockAccount = aBankAccountMonthView({ id: 1 });
    jest.mocked(bankAccountsService.addBudgetExpense).mockResolvedValue(mockAccount as never);

    const { result } = renderMutateHook(() => useAddBudgetExpense());
    result.current.mutate({
      accountId: 1,
      budgetId: 2,
      input: { expenseDate: '2026-03-05', debitDate: '2026-03-06', description: 'Courses', amount: 50 },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(bankAccountsService.addBudgetExpense).toHaveBeenCalledWith(
      TEST_FAMILY_ID, 1, 2,
      { expenseDate: '2026-03-05', debitDate: '2026-03-06', description: 'Courses', amount: 50 }
    );
  });

  test('useAddCharge calls service with accountId and input', async () => {
    const mockAccount = aBankAccountMonthView({ id: 1 });
    jest.mocked(bankAccountsService.addCharge).mockResolvedValue(mockAccount as never);

    const { result } = renderMutateHook(() => useAddCharge());
    result.current.mutate({ accountId: 1, input: { description: 'Loyer', amount: 900, debitDate: '2026-03-01', periodicity: 'MONTHLY' } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(bankAccountsService.addCharge).toHaveBeenCalledWith(
      TEST_FAMILY_ID, 1,
      { description: 'Loyer', amount: 900, debitDate: '2026-03-01', periodicity: 'MONTHLY' }
    );
  });

  test('useAddCredit calls service with accountId and input', async () => {
    const mockAccount = aBankAccountMonthView({ id: 1 });
    jest.mocked(bankAccountsService.addCredit).mockResolvedValue(mockAccount as never);

    const { result } = renderMutateHook(() => useAddCredit());
    result.current.mutate({ accountId: 1, input: { description: 'Salaire', amount: 2500, creditDate: '2026-03-28' } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(bankAccountsService.addCredit).toHaveBeenCalledWith(
      TEST_FAMILY_ID, 1,
      { description: 'Salaire', amount: 2500, creditDate: '2026-03-28' }
    );
  });

  test('useAddExpense calls service with accountId and input', async () => {
    const mockAccount = aBankAccountMonthView({ id: 1 });
    jest.mocked(bankAccountsService.addExpense).mockResolvedValue(mockAccount as never);

    const { result } = renderMutateHook(() => useAddExpense());
    result.current.mutate({ accountId: 1, input: { description: 'Restaurant', amount: 45, expenseDate: '2026-03-15', debitDate: '2026-03-16' } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(bankAccountsService.addExpense).toHaveBeenCalledWith(
      TEST_FAMILY_ID, 1,
      { description: 'Restaurant', amount: 45, expenseDate: '2026-03-15', debitDate: '2026-03-16' }
    );
  });
});
