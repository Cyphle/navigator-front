export interface AccountSummary {
  name: string;
  type: string;
  period?: {
    from: string;
    to: string;
  },
  startingBalance: number;
  currentBalance: number;
  projectedBalance: number;
}

export interface Account {
  id: number;
  username: string;
  summary: AccountSummary;
  budgets: Budget[];
  transactions: AccountTransaction[];
  parameters?: AccountParameters;
}

export interface Budget {
  id: number;
  initialAmount: number;
  actualAmount: number;
  name: string;
  startDate: string;
  endDate?: string;
  frequency: FREQUENCY;
}

export type TransactionType = 'CHARGE' | 'CREDIT' | 'EXPENSE' | 'BUDGET' | 'ALL';

export interface AccountTransaction {
  id: number;
  executedAt: string;
  appliedAt: string;
  type: TransactionType;
  description: string;
  amount: number;
  startDate?: string;
  endDate?: string;
  budgetId: number;
}

export type FREQUENCY = 'MONTHLY';

export interface AccountParameters {
  distribution: {
    [name: string]: {
      salary: number;
      percentage: number;
      amount: number;
      balance: number;
    }
  }
}

export interface CreateAccountRequest {
  username: string;
  name: string;
  type: string;
  startingBalance: number;
  currentBalance: number;
  projectedBalance: number;
}

export interface AccountView {
  id: number;
  summary: AccountSummary;
  budgets: Budget[];
  transactions: AccountTransaction[];
  parameters?: AccountParameters;
}