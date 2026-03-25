import type {
  BankAccount,
  BudgetMonthView,
  BankAccountMonthView,
  CreateBankAccountInput,
  CreateBudgetInput,
  CreateBudgetExpenseInput,
  CreateChargeInput,
  CreateCreditInput,
  CreateExpenseInput,
} from './bank-accounts.types';

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

let bankAccounts: BankAccount[] = [
  {
    id: 1,
    name: 'Compte courant',
    startingAmount: 1000,
    startDate: '2026-01-01',
    visibility: 'SHARED',
    familyId: 1,
    budgets: [
      {
        id: 1,
        name: 'Alimentation',
        initialAmount: 400,
        expenses: [
          {
            id: 1,
            expenseDate: '2026-03-05',
            debitDate: '2026-03-06',
            description: 'Courses Carrefour',
            amount: 85,
          },
          {
            id: 2,
            expenseDate: '2026-03-12',
            debitDate: '2026-03-13',
            description: 'Marché du dimanche',
            amount: 45,
          },
        ],
      },
      {
        id: 2,
        name: 'Loisirs',
        initialAmount: 200,
        expenses: [
          {
            id: 3,
            expenseDate: '2026-03-08',
            debitDate: '2026-03-09',
            description: 'Cinéma',
            amount: 28,
          },
        ],
      },
    ],
    charges: [
      {
        id: 1,
        description: 'Loyer',
        amount: 900,
        debitDate: '2026-03-01',
        periodicity: 'MONTHLY',
      },
      {
        id: 2,
        description: 'Internet',
        amount: 40,
        debitDate: '2026-03-05',
        periodicity: 'MONTHLY',
      },
      {
        id: 3,
        description: 'Assurance voiture',
        amount: 120,
        debitDate: '2026-01-15',
        periodicity: 'YEARLY',
      },
    ],
    credits: [
      {
        id: 1,
        description: 'Salaire',
        amount: 2500,
        creditDate: '2026-03-28',
      },
      {
        id: 2,
        description: 'Remboursement',
        amount: 150,
        creditDate: '2026-03-10',
      },
    ],
    expenses: [
      {
        id: 1,
        description: 'Restaurant',
        amount: 45,
        expenseDate: '2026-03-15',
        debitDate: '2026-03-16',
      },
      {
        id: 2,
        description: 'Taxi',
        amount: 22,
        expenseDate: '2026-03-18',
        debitDate: '2026-03-19',
      },
    ],
  },
];

let nextAccountId = 2;
let nextBudgetId = 3;
let nextBudgetExpenseId = 4;
let nextChargeId = 4;
let nextCreditId = 3;
let nextExpenseId = 3;

export const getAllBankAccounts = (familyId: number): BankAccount[] => {
  return bankAccounts.filter((a) => a.familyId === familyId);
};

export const getBankAccountById = (id: number): BankAccount | undefined => {
  return bankAccounts.find((a) => a.id === id);
};

export const getBankAccountByIdForMonth = (
  id: number,
  year: number,
  month: number
): BankAccountMonthView | undefined => {
  const account = bankAccounts.find((a) => a.id === id);
  if (!account) return undefined;

  const monthStr = `${year}-${String(month).padStart(2, '0')}`;

  const monthCredits = account.credits.filter((c) => c.creditDate.startsWith(monthStr));
  const monthExpenses = account.expenses.filter((e) => e.expenseDate.startsWith(monthStr));
  const monthCharges = account.charges.filter(
    (c) => c.periodicity === 'MONTHLY' || (c.periodicity === 'YEARLY' && c.debitDate.startsWith(monthStr))
  );

  const monthBudgets: BudgetMonthView[] = account.budgets.map((budget) => {
    const monthBudgetExpenses = budget.expenses.filter((e) => e.expenseDate.startsWith(monthStr));
    const currentAmount = budget.initialAmount - monthBudgetExpenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      id: budget.id,
      name: budget.name,
      initialAmount: budget.initialAmount,
      currentAmount,
      expenses: monthBudgetExpenses,
    };
  });

  const creditsSum = monthCredits.reduce((sum, c) => sum + c.amount, 0);
  const chargesSum = monthCharges.reduce((sum, c) => sum + c.amount, 0);
  const budgetsInitialSum = monthBudgets.reduce((sum, b) => sum + b.initialAmount, 0);
  const budgetsCurrentSum = monthBudgets.reduce((sum, b) => sum + b.currentAmount, 0);
  const expensesSum = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const remainingAmount = account.startingAmount + creditsSum - budgetsInitialSum - chargesSum;
  const actualAmount =
    account.startingAmount + creditsSum - (budgetsInitialSum - budgetsCurrentSum) - chargesSum - expensesSum;
  const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  return {
    id: account.id,
    name: account.name,
    startingAmount: account.startingAmount,
    startDate: account.startDate,
    visibility: account.visibility,
    familyId: account.familyId,
    monthLabel,
    remainingAmount,
    actualAmount,
    budgets: monthBudgets,
    charges: monthCharges,
    credits: monthCredits,
    expenses: monthExpenses,
  };
};

export const createBankAccount = (familyId: number, input: CreateBankAccountInput): BankAccount => {
  const newAccount: BankAccount = {
    id: nextAccountId++,
    name: input.name,
    startingAmount: input.startingAmount,
    startDate: input.startDate,
    visibility: input.visibility,
    familyId,
    budgets: [],
    charges: [],
    credits: [],
    expenses: [],
  };
  bankAccounts.push(newAccount);
  return newAccount;
};

export const addBudget = (accountId: number, input: CreateBudgetInput): BankAccount | undefined => {
  const account = bankAccounts.find((a) => a.id === accountId);
  if (!account) return undefined;

  account.budgets.push({
    id: nextBudgetId++,
    name: input.name,
    initialAmount: input.initialAmount,
    expenses: [],
  });

  return account;
};

export const addBudgetExpense = (
  accountId: number,
  budgetId: number,
  input: CreateBudgetExpenseInput
): BankAccount | undefined => {
  const account = bankAccounts.find((a) => a.id === accountId);
  if (!account) return undefined;

  const budget = account.budgets.find((b) => b.id === budgetId);
  if (!budget) return undefined;

  budget.expenses.push({
    id: nextBudgetExpenseId++,
    expenseDate: input.expenseDate,
    debitDate: input.debitDate,
    description: input.description,
    amount: input.amount,
  });

  return account;
};

export const addCharge = (accountId: number, input: CreateChargeInput): BankAccount | undefined => {
  const account = bankAccounts.find((a) => a.id === accountId);
  if (!account) return undefined;

  account.charges.push({
    id: nextChargeId++,
    description: input.description,
    amount: input.amount,
    debitDate: input.debitDate,
    periodicity: input.periodicity,
  });

  return account;
};

export const addCredit = (accountId: number, input: CreateCreditInput): BankAccount | undefined => {
  const account = bankAccounts.find((a) => a.id === accountId);
  if (!account) return undefined;

  account.credits.push({
    id: nextCreditId++,
    description: input.description,
    amount: input.amount,
    creditDate: input.creditDate,
  });

  return account;
};

export const addExpense = (accountId: number, input: CreateExpenseInput): BankAccount | undefined => {
  const account = bankAccounts.find((a) => a.id === accountId);
  if (!account) return undefined;

  account.expenses.push({
    id: nextExpenseId++,
    description: input.description,
    amount: input.amount,
    expenseDate: input.expenseDate,
    debitDate: input.debitDate,
  });

  return account;
};
