import { TrendingUp, PiggyBank, Receipt, CreditCard } from 'lucide-react';
import type { BankAccountMonthView } from '../../../stores/bank-accounts/bank-accounts.types';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

type TransactionType = 'credit' | 'budget-expense' | 'charge' | 'expense';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  budgetName?: string;
}

interface TransactionsSectionProps {
  account: BankAccountMonthView;
}

const TYPE_LABELS: Record<TransactionType, string> = {
  credit: 'Crédit',
  'budget-expense': 'Budget',
  charge: 'Charge',
  expense: 'Dépense',
};

const TransactionIcon = ({ type }: { type: TransactionType }) => {
  switch (type) {
    case 'credit':
      return <TrendingUp className="w-4 h-4" />;
    case 'budget-expense':
      return <PiggyBank className="w-4 h-4" />;
    case 'charge':
      return <CreditCard className="w-4 h-4" />;
    case 'expense':
      return <Receipt className="w-4 h-4" />;
  }
};

export const TransactionsSection = ({ account }: TransactionsSectionProps) => {
  const transactions: Transaction[] = [
    ...account.credits.map((c): Transaction => ({
      id: `credit-${c.id}`,
      date: c.creditDate,
      description: c.description,
      amount: c.amount,
      type: 'credit',
    })),
    ...account.budgets.flatMap((b) =>
      b.expenses.map((e): Transaction => ({
        id: `budget-expense-${e.id}`,
        date: e.expenseDate,
        description: e.description,
        amount: -e.amount,
        type: 'budget-expense',
        budgetName: b.name,
      }))
    ),
    ...account.charges.map((c): Transaction => ({
      id: `charge-${c.id}`,
      date: c.debitDate,
      description: c.description,
      amount: -c.amount,
      type: 'charge',
    })),
    ...account.expenses.map((e): Transaction => ({
      id: `expense-${e.id}`,
      date: e.expenseDate,
      description: e.description,
      amount: -e.amount,
      type: 'expense',
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-3">
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <p className="text-sm font-medium" style={{ color: 'var(--mist)' }}>
            Aucune transaction
          </p>
        </div>
      ) : (
        <div
          className="bg-white rounded-[var(--radius-lg)] overflow-hidden"
          style={{ boxShadow: 'var(--shadow-soft)' }}
        >
          {transactions.map((tx, index) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 px-4 py-3 text-sm"
              style={{
                borderTop: index > 0 ? '1px solid rgba(0,0,0,0.05)' : undefined,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={
                  tx.amount > 0
                    ? { background: 'var(--sage-pale)', color: 'var(--sage)' }
                    : { background: 'var(--coral-pale)', color: 'var(--coral)' }
                }
              >
                <TransactionIcon type={tx.type} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate" style={{ color: 'var(--stone)' }}>
                    {tx.description}
                  </p>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={
                      tx.type === 'credit'
                        ? { background: 'var(--sage-pale)', color: 'var(--sage)' }
                        : tx.type === 'budget-expense'
                        ? { background: 'var(--ocean-pale)', color: 'var(--ocean)' }
                        : { background: 'var(--coral-pale)', color: 'var(--coral)' }
                    }
                  >
                    {tx.budgetName ?? TYPE_LABELS[tx.type]}
                  </span>
                </div>
                <p className="text-xs" style={{ color: 'var(--mist)' }}>
                  {tx.date}
                </p>
              </div>

              <span
                className="font-semibold ml-2 shrink-0"
                style={{ color: tx.amount > 0 ? 'var(--sage)' : 'var(--coral)' }}
              >
                {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
