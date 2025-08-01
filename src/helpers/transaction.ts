import { DisplayableTransaction } from '../components/transactions/Transactions.tsx';
import { AccountTransaction } from '../stores/account/account.types.ts';

// TODO to be tested
export const fromAccountTransactionToDisplayableTransaction = (transaction: AccountTransaction): DisplayableTransaction => {
  return {
    id: transaction.id,
    executedAt: transaction.executedAt,
    appliedAt: transaction.appliedAt,
    type: transaction.type,
    description: transaction.description,
    amount: transaction.amount,
  }
}

export const fromAccountTransactionsToDisplayableTransactions = (transactions: AccountTransaction[]): DisplayableTransaction[] => {
  return transactions.map((transaction: AccountTransaction) => fromAccountTransactionToDisplayableTransaction(transaction));
}
