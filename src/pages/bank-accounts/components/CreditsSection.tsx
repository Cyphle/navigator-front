import { useState } from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import type { Credit } from '../../../stores/bank-accounts/bank-accounts.types';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

type SortKey = 'amount' | 'date' | 'description';

interface CreditsSectionProps {
  credits: Credit[];
  onAdd: () => void;
}

export const CreditsSection = ({ credits, onAdd }: CreditsSectionProps) => {
  const [sortKey, setSortKey] = useState<SortKey>('date');

  const sortedCredits = [...credits].sort((a, b) => {
    if (sortKey === 'amount') return b.amount - a.amount;
    if (sortKey === 'description') return a.description.localeCompare(b.description);
    return a.creditDate.localeCompare(b.creditDate);
  });

  const total = credits.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
            Trier par
          </span>
          {(['date', 'amount', 'description'] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              className="text-xs font-semibold px-3 py-1 rounded-full border transition-colors"
              style={
                sortKey === key
                  ? { background: 'var(--ocean)', color: 'white', borderColor: 'var(--ocean)' }
                  : { background: 'white', color: 'var(--stone)', borderColor: 'var(--mist)' }
              }
            >
              {key === 'date' ? 'Date' : key === 'amount' ? 'Montant' : 'Description'}
            </button>
          ))}
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)] transition-all duration-150 hover:-translate-y-px"
          style={{
            background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
            boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
          }}
        >
          <Plus className="w-4 h-4" />
          Ajouter un crédit
        </button>
      </div>

      {credits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div
            className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center"
            style={{ background: 'var(--sage-pale)', color: 'var(--sage)' }}
          >
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--mist)' }}>
            Aucun crédit défini
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div
            className="bg-white rounded-[var(--radius-lg)] overflow-hidden"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            {sortedCredits.map((credit, index) => (
              <div
                key={credit.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
                style={{
                  borderTop: index > 0 ? '1px solid rgba(0,0,0,0.05)' : undefined,
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" style={{ color: 'var(--stone)' }}>
                    {credit.description}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--mist)' }}>
                    {credit.creditDate}
                  </p>
                </div>
                <span className="font-semibold ml-4 shrink-0" style={{ color: 'var(--sage)' }}>
                  +{formatCurrency(credit.amount)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-lg)]"
            style={{ background: 'var(--sage-pale)' }}
          >
            <span className="text-sm font-semibold" style={{ color: 'var(--sage)' }}>
              Total crédits
            </span>
            <span className="text-sm font-bold" style={{ color: 'var(--sage)' }}>
              +{formatCurrency(total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
