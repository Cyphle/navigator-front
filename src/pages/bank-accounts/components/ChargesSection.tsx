import { useState } from 'react';
import { Plus, TrendingDown } from 'lucide-react';
import type { Charge } from '../../../stores/bank-accounts/bank-accounts.types';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

type SortKey = 'amount' | 'date' | 'description';

interface ChargesSectionProps {
  charges: Charge[];
  onAdd: () => void;
}

export const ChargesSection = ({ charges, onAdd }: ChargesSectionProps) => {
  const [sortKey, setSortKey] = useState<SortKey>('date');

  const sortedCharges = [...charges].sort((a, b) => {
    if (sortKey === 'amount') return b.amount - a.amount;
    if (sortKey === 'description') return a.description.localeCompare(b.description);
    return a.debitDate.localeCompare(b.debitDate);
  });

  const total = charges.reduce((sum, c) => sum + c.amount, 0);

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
          Ajouter une charge
        </button>
      </div>

      {charges.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div
            className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center"
            style={{ background: 'var(--coral-pale)', color: 'var(--coral)' }}
          >
            <TrendingDown className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--mist)' }}>
            Aucune charge définie
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div
            className="bg-white rounded-[var(--radius-lg)] overflow-hidden"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            {sortedCharges.map((charge, index) => (
              <div
                key={charge.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
                style={{
                  borderTop: index > 0 ? '1px solid rgba(0,0,0,0.05)' : undefined,
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" style={{ color: 'var(--stone)' }}>
                    {charge.description}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--mist)' }}>
                    Débit le {charge.debitDate}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={
                      charge.periodicity === 'MONTHLY'
                        ? { background: 'var(--ocean-pale)', color: 'var(--ocean)' }
                        : { background: 'var(--sun-pale)', color: 'var(--stone)' }
                    }
                  >
                    {charge.periodicity === 'MONTHLY' ? 'Mensuelle' : 'Annuelle'}
                  </span>
                  <span className="font-semibold" style={{ color: 'var(--coral)' }}>
                    -{formatCurrency(charge.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-lg)]"
            style={{ background: 'var(--coral-pale)' }}
          >
            <span className="text-sm font-semibold" style={{ color: 'var(--coral)' }}>
              Total charges
            </span>
            <span className="text-sm font-bold" style={{ color: 'var(--coral)' }}>
              -{formatCurrency(total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
