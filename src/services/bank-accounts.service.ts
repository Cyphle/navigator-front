import { getOne, post } from '../helpers/http';
import type {
  BankAccount,
  BudgetMonthView,
  BankAccountMonthView,
  BankAccountSummaryItem,
  Budget,
  BudgetExpense,
  Charge,
  Credit,
  Expense,
  CreateBankAccountInput,
  CreateBudgetInput,
  CreateBudgetExpenseInput,
  CreateChargeInput,
  CreateCreditInput,
  CreateExpenseInput,
} from '../stores/bank-accounts/bank-accounts.types';

const responseToBudgetExpense = (data: Record<string, unknown>): BudgetExpense => ({
  id: (data.id as number) ?? 0,
  expenseDate: (data.expenseDate as string) ?? '',
  debitDate: (data.debitDate as string) ?? '',
  description: (data.description as string) ?? '',
  amount: (data.amount as number) ?? 0,
});

const responseToBudget = (data: Record<string, unknown>): Budget => ({
  id: (data.id as number) ?? 0,
  name: (data.name as string) ?? '',
  initialAmount: (data.initialAmount as number) ?? 0,
  expenses: Array.isArray(data.expenses)
    ? (data.expenses as Record<string, unknown>[]).map(responseToBudgetExpense)
    : [],
});

const responseToCharge = (data: Record<string, unknown>): Charge => ({
  id: (data.id as number) ?? 0,
  description: (data.description as string) ?? '',
  amount: (data.amount as number) ?? 0,
  debitDate: (data.debitDate as string) ?? '',
  periodicity: (data.periodicity as Charge['periodicity']) ?? 'MONTHLY',
});

const responseToCredit = (data: Record<string, unknown>): Credit => ({
  id: (data.id as number) ?? 0,
  description: (data.description as string) ?? '',
  amount: (data.amount as number) ?? 0,
  creditDate: (data.creditDate as string) ?? '',
});

const responseToExpense = (data: Record<string, unknown>): Expense => ({
  id: (data.id as number) ?? 0,
  description: (data.description as string) ?? '',
  amount: (data.amount as number) ?? 0,
  expenseDate: (data.expenseDate as string) ?? '',
  debitDate: (data.debitDate as string) ?? '',
});

const responseToBankAccount = (data: Record<string, unknown>): BankAccount => ({
  id: (data.id as number) ?? 0,
  name: (data.name as string) ?? '',
  startingAmount: (data.startingAmount as number) ?? 0,
  startDate: (data.startDate as string) ?? '',
  visibility: (data.visibility as BankAccount['visibility']) ?? 'PERSONAL',
  familyId: data.familyId as number | undefined,
  budgets: Array.isArray(data.budgets)
    ? (data.budgets as Record<string, unknown>[]).map(responseToBudget)
    : [],
  charges: Array.isArray(data.charges)
    ? (data.charges as Record<string, unknown>[]).map(responseToCharge)
    : [],
  credits: Array.isArray(data.credits)
    ? (data.credits as Record<string, unknown>[]).map(responseToCredit)
    : [],
  expenses: Array.isArray(data.expenses)
    ? (data.expenses as Record<string, unknown>[]).map(responseToExpense)
    : [],
});

const responseToBudgetMonthView = (data: Record<string, unknown>): BudgetMonthView => ({
  id: (data.id as number) ?? 0,
  name: (data.name as string) ?? '',
  initialAmount: (data.initialAmount as number) ?? 0,
  currentAmount: (data.currentAmount as number) ?? 0,
  expenses: Array.isArray(data.expenses)
    ? (data.expenses as Record<string, unknown>[]).map(responseToBudgetExpense)
    : [],
});

const responseToBankAccountMonthView = (data: Record<string, unknown>): BankAccountMonthView => ({
  id: (data.id as number) ?? 0,
  name: (data.name as string) ?? '',
  startingAmount: (data.startingAmount as number) ?? 0,
  startDate: (data.startDate as string) ?? '',
  visibility: (data.visibility as BankAccountMonthView['visibility']) ?? 'PERSONAL',
  familyId: data.familyId as number | undefined,
  monthLabel: (data.monthLabel as string) ?? '',
  remainingAmount: (data.remainingAmount as number) ?? 0,
  actualAmount: (data.actualAmount as number) ?? 0,
  budgets: Array.isArray(data.budgets)
    ? (data.budgets as Record<string, unknown>[]).map(responseToBudgetMonthView)
    : [],
  charges: Array.isArray(data.charges)
    ? (data.charges as Record<string, unknown>[]).map(responseToCharge)
    : [],
  credits: Array.isArray(data.credits)
    ? (data.credits as Record<string, unknown>[]).map(responseToCredit)
    : [],
  expenses: Array.isArray(data.expenses)
    ? (data.expenses as Record<string, unknown>[]).map(responseToExpense)
    : [],
});

const responseToBankAccountSummaryItem = (data: Record<string, unknown>): BankAccountSummaryItem => ({
  id: (data.id as number) ?? 0,
  name: (data.name as string) ?? '',
  visibility: (data.visibility as BankAccountSummaryItem['visibility']) ?? 'PERSONAL',
  actualAmount: (data.actualAmount as number) ?? 0,
  endOfMonthForecast: (data.endOfMonthForecast as number) ?? 0,
});

export const getBankAccountsSummary = (familyId: string): Promise<BankAccountSummaryItem[]> => {
  return getOne(`families/${encodeURIComponent(familyId)}/bank-accounts/summary`, (data: unknown) => {
    if (!Array.isArray(data)) return [];
    return (data as Record<string, unknown>[]).map(responseToBankAccountSummaryItem);
  });
};

export const getAllBankAccounts = (familyId: string): Promise<BankAccount[]> => {
  return getOne(`families/${encodeURIComponent(familyId)}/bank-accounts`, (data: unknown) => {
    if (!Array.isArray(data)) return [];
    return (data as Record<string, unknown>[]).map(responseToBankAccount);
  });
};

export const getBankAccountById = (
  familyId: string,
  id: number,
  year: number,
  month: number
): Promise<BankAccountMonthView> => {
  return getOne(
    `families/${encodeURIComponent(familyId)}/bank-accounts/${id}?year=${year}&month=${month}`,
    (data: unknown) => responseToBankAccountMonthView(data as Record<string, unknown>)
  );
};

export const createBankAccount = (familyId: string, input: CreateBankAccountInput): Promise<BankAccount> => {
  return post(
    `families/${encodeURIComponent(familyId)}/bank-accounts`,
    input,
    (data: unknown) => responseToBankAccount(data as Record<string, unknown>)
  );
};

export const addBudget = (familyId: string, accountId: number, input: CreateBudgetInput): Promise<BankAccount> => {
  return post(
    `families/${encodeURIComponent(familyId)}/bank-accounts/${accountId}/budgets`,
    input,
    (data: unknown) => responseToBankAccount(data as Record<string, unknown>)
  );
};

export const addBudgetExpense = (
  familyId: string,
  accountId: number,
  budgetId: number,
  input: CreateBudgetExpenseInput
): Promise<BankAccount> => {
  return post(
    `families/${encodeURIComponent(familyId)}/bank-accounts/${accountId}/budgets/${budgetId}/expenses`,
    input,
    (data: unknown) => responseToBankAccount(data as Record<string, unknown>)
  );
};

export const addCharge = (familyId: string, accountId: number, input: CreateChargeInput): Promise<BankAccount> => {
  return post(
    `families/${encodeURIComponent(familyId)}/bank-accounts/${accountId}/charges`,
    input,
    (data: unknown) => responseToBankAccount(data as Record<string, unknown>)
  );
};

export const addCredit = (familyId: string, accountId: number, input: CreateCreditInput): Promise<BankAccount> => {
  return post(
    `families/${encodeURIComponent(familyId)}/bank-accounts/${accountId}/credits`,
    input,
    (data: unknown) => responseToBankAccount(data as Record<string, unknown>)
  );
};

export const addExpense = (familyId: string, accountId: number, input: CreateExpenseInput): Promise<BankAccount> => {
  return post(
    `families/${encodeURIComponent(familyId)}/bank-accounts/${accountId}/expenses`,
    input,
    (data: unknown) => responseToBankAccount(data as Record<string, unknown>)
  );
};
