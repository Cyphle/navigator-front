import type { BankAccountOverviewItem } from '../../../stores/bank-accounts/bank-accounts.types';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

interface BankAccountCardProps {
  account: BankAccountOverviewItem;
  onSelect: () => void;
}

export const BankAccountCard = ({ account, onSelect }: BankAccountCardProps) => {
  return (
    <article
      className="bg-white rounded-[var(--radius-lg)] p-6 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden"
      style={{ boxShadow: 'var(--shadow-soft)' }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-soft)')}
      onClick={onSelect}
    >
      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background:
            account.visibility === 'SHARED'
              ? 'linear-gradient(to right, var(--ocean), var(--ocean-light))'
              : 'linear-gradient(to right, var(--sage), var(--sage-pale))',
        }}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between mt-1 mb-3">
        <h3
          className="font-display text-[1.1rem] font-semibold truncate"
          style={{ color: 'var(--stone)' }}
        >
          {account.name}
        </h3>
        <span
          className="inline-block text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ml-2"
          style={
            account.visibility === 'SHARED'
              ? { background: 'var(--ocean-pale)', color: 'var(--ocean)' }
              : { background: 'var(--sage-pale)', color: 'var(--sage)' }
          }
        >
          {account.visibility === 'SHARED' ? 'Partagé' : 'Personnel'}
        </span>
      </div>

      {/* Key amounts */}
      <div className="space-y-1 pt-3 border-t border-black/5 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: 'var(--mist)' }}>Montant actuel</span>
          <span
            className="font-semibold"
            style={{ color: account.actualAmount < 0 ? 'var(--coral)' : 'var(--stone)' }}
          >
            {formatCurrency(account.actualAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: 'var(--mist)' }}>Restant estimé</span>
          <span
            className="font-semibold"
            style={{ color: account.remainingAmount < 0 ? 'var(--coral)' : 'var(--ocean)' }}
          >
            {formatCurrency(account.remainingAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: 'var(--mist)' }}>Crédits</span>
          <span className="font-medium" style={{ color: 'var(--sage)' }}>
            +{formatCurrency(account.totalCredits)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: 'var(--mist)' }}>Dépenses libres</span>
          <span className="font-medium" style={{ color: account.totalExpenses > 0 ? 'var(--coral)' : 'var(--mist)' }}>
            -{formatCurrency(account.totalExpenses)}
          </span>
        </div>
      </div>

      {/* Budgets */}
      {account.budgets.length > 0 && (
        <div className="pt-3 border-t border-black/5">
          <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--mist)' }}>
            Budgets
          </p>
          <ul className="space-y-1">
            {account.budgets.map((budget) => (
              <li key={budget.id} className="flex items-center justify-between text-xs">
                <span style={{ color: 'var(--stone)' }}>{budget.name}</span>
                <span
                  style={{ color: budget.remainingAmount < 0 ? 'var(--coral)' : 'var(--ocean)' }}
                  className="font-semibold"
                >
                  {formatCurrency(budget.remainingAmount)}
                  <span className="font-normal ml-0.5" style={{ color: 'var(--mist)' }}>
                    / {formatCurrency(budget.initialAmount)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
};
