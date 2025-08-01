import { TransactionType } from '../../stores/account/account.types.ts';

// TODO il faudrait un composant pour les transactions et un pour les transactions recurrentes
// TODO to be tested
export interface DisplayableTransaction {
  id: number;
  executedAt: string;
  appliedAt: string;
  type: TransactionType;
  description: string;
  amount: number;
}

export interface TransactionsProps {
  transactions: DisplayableTransaction[];
}

export const Transactions = (props: TransactionsProps) => {
  return (
    <section className="transactions">
      <ul>
        { (props.transactions).map((transaction: DisplayableTransaction) => (
          <li key={ `${transaction.type}-${transaction.id}` }>
            <span>{ transaction.executedAt }</span>
            <span>{ transaction.appliedAt }</span>
            <span>{ transaction.description }</span>
            <span>{ transaction.amount }</span>
          </li>
        ))
        }
      </ul>
    </section>
  )
}

// TODO to be tested
export const filterDisplayableTransactions = (transactions: DisplayableTransaction[], type: TransactionType): DisplayableTransaction[] => {
  if (type === 'ALL') {
    return transactions;
  } else {
    return transactions.filter((transaction: DisplayableTransaction) => transaction.type === type);
  }
}