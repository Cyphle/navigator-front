import { Wallet, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { BankAccountSummaryItem } from '@/stores/bank-accounts/bank-accounts.types';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

const amountColor = (amount: number) => (amount >= 0 ? 'var(--stone)' : 'var(--coral)');

interface BankAccountsSectionProps {
  accounts: BankAccountSummaryItem[];
}

export const BankAccountsSection = ({ accounts }: BankAccountsSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[var(--radius-lg)] overflow-hidden" style={{ boxShadow: 'var(--shadow-soft)' }}>
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-black/5">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center"
            style={{ background: '#D1FAE5', color: '#34D399' }}
          >
            <Wallet className="w-4 h-4" />
          </div>
          <h2 className="font-display text-base font-semibold m-0" style={{ color: 'var(--stone)' }}>
            Comptes bancaires
          </h2>
        </div>
      </div>

      {accounts.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <p className="text-sm" style={{ color: 'var(--mist)' }}>
            Aucun compte bancaire
          </p>
        </div>
      ) : (
        <ul className="list-none p-0 m-0 divide-y divide-black/5">
          {accounts.map((account) => (
            <li
              key={account.id}
              className="px-6 py-4 flex items-center gap-4 hover:bg-[var(--sand)] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium m-0 truncate" style={{ color: 'var(--stone)' }}>
                    {account.name}
                  </p>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full shrink-0"
                    style={
                      account.visibility === 'SHARED'
                        ? { background: 'var(--ocean-pale)', color: 'var(--ocean)' }
                        : { background: 'var(--sage-pale)', color: 'var(--sage)' }
                    }
                  >
                    {account.visibility === 'SHARED' ? 'Partagé' : 'Personnel'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'var(--mist)' }}>
                    Actuel
                  </p>
                  <p className="text-sm font-bold m-0" style={{ color: amountColor(account.actualAmount) }}>
                    {formatCurrency(account.actualAmount)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end mb-0.5">
                    <TrendingUp className="w-3 h-3" style={{ color: 'var(--mist)' }} />
                    <p className="text-[10px] font-semibold uppercase tracking-wide m-0" style={{ color: 'var(--mist)' }}>
                      Fin de mois
                    </p>
                  </div>
                  <p
                    className="text-sm font-bold m-0"
                    style={{ color: amountColor(account.endOfMonthForecast) }}
                  >
                    {formatCurrency(account.endOfMonthForecast)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="px-6 py-4 border-t border-black/5">
        <Button
          variant="ghost"
          className="w-full justify-between text-xs font-medium"
          style={{ color: '#34D399' }}
          onClick={() => navigate('/bank-accounts')}
        >
          Gérer les comptes
          <ArrowRight className="w-3.5 h-3.5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
