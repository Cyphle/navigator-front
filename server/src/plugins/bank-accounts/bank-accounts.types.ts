export type AccountVisibility = 'SHARED' | 'PERSONAL';
export type ChargePeriodicity = 'MONTHLY' | 'YEARLY';

export interface BudgetExpense {
  id: number;
  expenseDate: string;
  debitDate: string;
  description: string;
  amount: number;
}

export interface Budget {
  id: number;
  name: string;
  initialAmount: number;
  expenses: BudgetExpense[];
}

export interface Charge {
  id: number;
  description: string;
  amount: number;
  debitDate: string;
  periodicity: ChargePeriodicity;
}

export interface Credit {
  id: number;
  description: string;
  amount: number;
  creditDate: string;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  expenseDate: string;
  debitDate: string;
}

export interface BankAccount {
  id: number;
  name: string;
  startingAmount: number;
  startDate: string;
  visibility: AccountVisibility;
  familyId?: number;
  budgets: Budget[];
  charges: Charge[];
  credits: Credit[];
  expenses: Expense[];
}

export interface BudgetMonthView {
  id: number;
  name: string;
  initialAmount: number;
  currentAmount: number;
  expenses: BudgetExpense[];
}

export interface BankAccountMonthView {
  id: number;
  name: string;
  startingAmount: number;
  startDate: string;
  visibility: AccountVisibility;
  familyId?: number;
  monthLabel: string;
  remainingAmount: number;
  actualAmount: number;
  budgets: BudgetMonthView[];
  charges: Charge[];
  credits: Credit[];
  expenses: Expense[];
}

export interface BankAccountSummaryItem {
  id: number;
  name: string;
  visibility: AccountVisibility;
  actualAmount: number;
  endOfMonthForecast: number;
}

export interface CreateBankAccountInput {
  name: string;
  startingAmount: number;
  startDate: string;
  visibility: AccountVisibility;
}

export interface CreateBudgetInput {
  name: string;
  initialAmount: number;
}

export interface CreateBudgetExpenseInput {
  expenseDate: string;
  debitDate: string;
  description: string;
  amount: number;
}

export interface CreateChargeInput {
  description: string;
  amount: number;
  debitDate: string;
  periodicity: ChargePeriodicity;
}

export interface CreateCreditInput {
  description: string;
  amount: number;
  creditDate: string;
}

export interface CreateExpenseInput {
  description: string;
  amount: number;
  expenseDate: string;
  debitDate: string;
}
