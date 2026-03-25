import type { BankAccount } from '../../../stores/bank-accounts/bank-accounts.types';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

interface BankAccountCardProps {
  account: BankAccount;
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

      <h3
        className="font-display text-[1.1rem] font-semibold mb-2 mt-1 truncate"
        style={{ color: 'var(--stone)' }}
      >
        {account.name}
      </h3>

      <span
        className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3"
        style={
          account.visibility === 'SHARED'
            ? { background: 'var(--ocean-pale)', color: 'var(--ocean)' }
            : { background: 'var(--sage-pale)', color: 'var(--sage)' }
        }
      >
        {account.visibility === 'SHARED' ? 'Partagé' : 'Personnel'}
      </span>

      <div className="space-y-1 pt-3 border-t border-black/5">
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: 'var(--mist)' }}>Montant de départ</span>
          <span className="font-semibold" style={{ color: 'var(--stone)' }}>
            {formatCurrency(account.startingAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: 'var(--mist)' }}>Depuis le</span>
          <span className="font-medium" style={{ color: 'var(--stone)' }}>
            {account.startDate}
          </span>
        </div>
      </div>
    </article>
  );
};
