import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, PiggyBank } from 'lucide-react';
import type { BudgetMonthView } from '../../../stores/bank-accounts/bank-accounts.types';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

type SortKey = 'amount' | 'name';
type ExpenseSortKey = 'amount' | 'date';

interface BudgetsSectionProps {
  budgets: BudgetMonthView[];
  onAddBudget: () => void;
  onAddExpense: (budgetId: number) => void;
}

export const BudgetsSection = ({ budgets, onAddBudget, onAddExpense }: BudgetsSectionProps) => {
  const [expandedBudgetIds, setExpandedBudgetIds] = useState<Set<number>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [expenseSortKey, setExpenseSortKey] = useState<ExpenseSortKey>('date');

  const toggleBudget = (id: number) => {
    setExpandedBudgetIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const sortedBudgets = [...budgets].sort((a, b) => {
    if (sortKey === 'amount') return b.initialAmount - a.initialAmount;
    return a.name.localeCompare(b.name);
  });

  const totalInitial = budgets.reduce((sum, b) => sum + b.initialAmount, 0);
  const totalCurrent = budgets.reduce((sum, b) => sum + b.currentAmount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
            Trier par
          </span>
          <button
            onClick={() => setSortKey('name')}
            className="text-xs font-semibold px-3 py-1 rounded-full border transition-colors"
            style={
              sortKey === 'name'
                ? { background: 'var(--ocean)', color: 'white', borderColor: 'var(--ocean)' }
                : { background: 'white', color: 'var(--stone)', borderColor: 'var(--mist)' }
            }
          >
            Nom
          </button>
          <button
            onClick={() => setSortKey('amount')}
            className="text-xs font-semibold px-3 py-1 rounded-full border transition-colors"
            style={
              sortKey === 'amount'
                ? { background: 'var(--ocean)', color: 'white', borderColor: 'var(--ocean)' }
                : { background: 'white', color: 'var(--stone)', borderColor: 'var(--mist)' }
            }
          >
            Montant
          </button>
        </div>
        <button
          onClick={onAddBudget}
          className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)] transition-all duration-150 hover:-translate-y-px"
          style={{
            background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
            boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
          }}
        >
          <Plus className="w-4 h-4" />
          Ajouter un budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div
            className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center"
            style={{ background: 'var(--ocean-pale)', color: 'var(--ocean)' }}
          >
            <PiggyBank className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--mist)' }}>
            Aucun budget défini
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedBudgets.map((budget) => {
            const spentPercent = Math.min(
              100,
              ((budget.initialAmount - budget.currentAmount) / budget.initialAmount) * 100
            );
            const isExpanded = expandedBudgetIds.has(budget.id);

            const sortedExpenses = [...budget.expenses].sort((a, b) => {
              if (expenseSortKey === 'amount') return b.amount - a.amount;
              return b.expenseDate.localeCompare(a.expenseDate);
            });

            return (
              <div
                key={budget.id}
                className="bg-white rounded-[var(--radius-lg)] overflow-hidden"
                style={{ boxShadow: 'var(--shadow-soft)' }}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate" style={{ color: 'var(--stone)' }}>
                        {budget.name}
                      </h4>
                      <div className="flex gap-4 mt-1 text-xs" style={{ color: 'var(--mist)' }}>
                        <span>Initial : {formatCurrency(budget.initialAmount)}</span>
                        <span>Restant : {formatCurrency(budget.currentAmount)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onAddExpense(budget.id)}
                        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-sm)] border transition-colors hover:bg-[var(--ocean-pale)]"
                        style={{ borderColor: 'var(--ocean)', color: 'var(--ocean)' }}
                      >
                        <Plus className="w-3 h-3" />
                        Dépense
                      </button>
                      {budget.expenses.length > 0 && (
                        <button
                          onClick={() => toggleBudget(budget.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-md transition-colors hover:bg-black/5"
                          style={{ color: 'var(--mist)' }}
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--sand)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${spentPercent}%`,
                        background: spentPercent > 80
                          ? 'var(--coral)'
                          : spentPercent > 60
                          ? 'var(--sun)'
                          : 'var(--ocean)',
                      }}
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--mist)' }}>
                    {budget.expenses.length} dépense{budget.expenses.length !== 1 ? 's' : ''} — {spentPercent.toFixed(0)} % consommé
                  </p>
                </div>

                {/* Expenses list */}
                {isExpanded && budget.expenses.length > 0 && (
                  <div className="border-t border-black/5">
                    <div className="flex items-center gap-2 px-4 py-2" style={{ background: 'var(--sand)' }}>
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                        Trier par
                      </span>
                      <button
                        onClick={() => setExpenseSortKey('date')}
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-colors"
                        style={
                          expenseSortKey === 'date'
                            ? { background: 'var(--ocean)', color: 'white', borderColor: 'var(--ocean)' }
                            : { background: 'white', color: 'var(--stone)', borderColor: 'var(--mist)' }
                        }
                      >
                        Date
                      </button>
                      <button
                        onClick={() => setExpenseSortKey('amount')}
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-colors"
                        style={
                          expenseSortKey === 'amount'
                            ? { background: 'var(--ocean)', color: 'white', borderColor: 'var(--ocean)' }
                            : { background: 'white', color: 'var(--stone)', borderColor: 'var(--mist)' }
                        }
                      >
                        Montant
                      </button>
                    </div>
                    {sortedExpenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between px-4 py-2.5 text-sm border-b border-black/5 last:border-b-0"
                        style={{ background: 'var(--sand)' }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate" style={{ color: 'var(--stone)' }}>
                            {expense.description}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--mist)' }}>
                            Dépensé le {expense.expenseDate} · Débité le {expense.debitDate}
                          </p>
                        </div>
                        <span className="font-semibold ml-4 shrink-0" style={{ color: 'var(--coral)' }}>
                          -{formatCurrency(expense.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Totals */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-lg)]"
            style={{ background: 'var(--ocean-pale)' }}
          >
            <span className="text-sm font-semibold" style={{ color: 'var(--ocean)' }}>
              Total budgets
            </span>
            <div className="flex gap-6 text-sm">
              <span style={{ color: 'var(--mist)' }}>
                Initial : <strong style={{ color: 'var(--stone)' }}>{formatCurrency(totalInitial)}</strong>
              </span>
              <span style={{ color: 'var(--mist)' }}>
                Restant : <strong style={{ color: 'var(--ocean)' }}>{formatCurrency(totalCurrent)}</strong>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
