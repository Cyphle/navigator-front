import { getMany, getOne } from '../helpers/http.ts';
import { Account, AccountSummary, AccountTransaction, Budget } from '../stores/account/account.types.ts';

export const getAccountSummaries = (): Promise<AccountSummary[]> => {
  return getMany(`accounts`, responseToAccountSummaries);
}

export const responseToAccountSummaries = (data: any): AccountSummary[] => {
  return data.map((account: any) => toAccountSummary(account.id, account));
}

export const getAccount = (id: number): Promise<Account> => {
  return getOne(`accounts/${id}`, responseToAccount);
}

export const responseToAccount = (data: any): Account => {
  return {
    id: data.id,
    summary: toAccountSummary(data.id, data),
    budgets: data.budgets.map((budget: any) => toBudget(budget)),
    transactions: data.transactions.map((transaction: any) => toTransaction(transaction)),
    parameters: data.parameters
  };
}

const toBudget = (budget: any): Budget => {
  return {
    id: budget.id,
    initialAmount: budget.initialAmount,
    actualAmount: budget.actualAmount,
    name: budget.name,
    startDate: budget.startDate,
    endDate: budget.endDate,
    frequency: budget.frequency,
  }
}

const toTransaction = (transaction: any): AccountTransaction => {
  return {
    id: transaction.id,
    executedAt: transaction.executedAt,
    appliedAt: transaction.appliedAt,
    type: transaction.type,
    description: transaction.description,
    amount: transaction.amount,
    startDate: transaction.startDate,
    endDate: transaction.endDate,
    budgetId: transaction.budgetId,
  }
}

const toAccountSummary = (id: number, account: any): AccountSummary => {
  return {
    id: id,
    name: account.summary.name,
    type: account.summary.type,
    period: account.summary.period ? {
      from: account.summary.period.from,
      to: account.summary.period.to
    } : undefined,
    startingBalance: account.summary.startingBalance,
    currentBalance: account.summary.currentBalance,
    projectedBalance: account.summary.projectedBalance,
  }
}