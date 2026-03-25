import { Plus, Wallet } from 'lucide-react';
import type { BankAccount } from '../../../stores/bank-accounts/bank-accounts.types';
import { BankAccountCard } from './BankAccountCard';

interface BankAccountsViewProps {
  accounts: BankAccount[];
  onSelect: (id: number) => void;
  onCreate: () => void;
}

export const BankAccountsView = ({ accounts, onSelect, onCreate }: BankAccountsViewProps) => {
  return (
    <div className="p-4 md:p-6 min-h-full" style={{ background: 'var(--sand)' }}>
      {/* Header */}
      <div className="flex justify-end mb-6">
        <button
          onClick={onCreate}
          className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-[var(--radius-sm)] transition-all duration-150 hover:-translate-y-px"
          style={{
            background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
            boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
          }}
        >
          <Plus className="w-4 h-4" />
          Ajouter un compte
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div
            className="w-16 h-16 rounded-[var(--radius-lg)] flex items-center justify-center"
            style={{ background: 'var(--ocean-pale)', color: 'var(--ocean)' }}
          >
            <Wallet className="w-8 h-8" />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--mist)' }}>
            Aucun compte bancaire
          </p>
          <button
            onClick={onCreate}
            className="text-sm font-semibold px-5 py-2 rounded-[var(--radius-sm)] border transition-colors hover:bg-[var(--ocean-pale)]"
            style={{ borderColor: 'var(--ocean)', color: 'var(--ocean)' }}
          >
            Créer mon premier compte
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <BankAccountCard
              key={account.id}
              account={account}
              onSelect={() => onSelect(account.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
