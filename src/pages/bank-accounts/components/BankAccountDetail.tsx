import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  useFetchBankAccountById,
  useAddBudget,
  useAddBudgetExpense,
  useAddCharge,
  useAddCredit,
  useAddExpense,
} from '../../../stores/bank-accounts/bank-accounts.queries';
import type {
  CreateBudgetInput,
  CreateBudgetExpenseInput,
  CreateChargeInput,
  CreateCreditInput,
  CreateExpenseInput,
} from '../../../stores/bank-accounts/bank-accounts.types';
import { BankAccountDetailContent } from './BankAccountDetailContent';

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

interface BankAccountDetailProps {
  accountId: number;
  onBack: () => void;
}

export const BankAccountDetail = ({ accountId, onBack }: BankAccountDetailProps) => {
  const { toast } = useToast();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const { data: account, isPending, isError } = useFetchBankAccountById(accountId, year, month);

  const addBudgetMutation = useAddBudget();
  const addBudgetExpenseMutation = useAddBudgetExpense();
  const addChargeMutation = useAddCharge();
  const addCreditMutation = useAddCredit();
  const addExpenseMutation = useAddExpense();

  const handlePrevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };

  const handleNextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const handleAddBudget = (input: CreateBudgetInput) => {
    addBudgetMutation.mutate(
      { accountId, input },
      {
        onSuccess: () => toast({ title: 'Budget ajouté' }),
        onError: () => toast({ title: "Erreur lors de l'ajout du budget", variant: 'destructive' }),
      }
    );
  };

  const handleAddBudgetExpense = (budgetId: number, input: CreateBudgetExpenseInput) => {
    addBudgetExpenseMutation.mutate(
      { accountId, budgetId, input },
      {
        onSuccess: () => toast({ title: 'Dépense ajoutée au budget' }),
        onError: () => toast({ title: "Erreur lors de l'ajout de la dépense", variant: 'destructive' }),
      }
    );
  };

  const handleAddCharge = (input: CreateChargeInput) => {
    addChargeMutation.mutate(
      { accountId, input },
      {
        onSuccess: () => toast({ title: 'Charge ajoutée' }),
        onError: () => toast({ title: "Erreur lors de l'ajout de la charge", variant: 'destructive' }),
      }
    );
  };

  const handleAddCredit = (input: CreateCreditInput) => {
    addCreditMutation.mutate(
      { accountId, input },
      {
        onSuccess: () => toast({ title: 'Crédit ajouté' }),
        onError: () => toast({ title: "Erreur lors de l'ajout du crédit", variant: 'destructive' }),
      }
    );
  };

  const handleAddExpense = (input: CreateExpenseInput) => {
    addExpenseMutation.mutate(
      { accountId, input },
      {
        onSuccess: () => toast({ title: 'Dépense ajoutée' }),
        onError: () => toast({ title: "Erreur lors de l'ajout de la dépense", variant: 'destructive' }),
      }
    );
  };

  const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  return (
    <div className="p-4 md:p-6 min-h-full" style={{ background: 'var(--sand)' }}>
      {/* Header — always visible */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] border border-black/10 transition-colors hover:bg-white shrink-0"
          style={{ color: 'var(--stone)' }}
          aria-label="Retour"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <Wallet className="w-5 h-5 shrink-0" style={{ color: 'var(--ocean)' }} />
          <h2 className="font-display text-xl font-bold truncate" style={{ color: 'var(--stone)' }}>
            {account?.name ?? '…'}
          </h2>
          {account && (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full ml-1 shrink-0"
              style={
                account.visibility === 'SHARED'
                  ? { background: 'var(--ocean-pale)', color: 'var(--ocean)' }
                  : { background: 'var(--sage-pale)', color: 'var(--sage)' }
              }
            >
              {account.visibility === 'SHARED' ? 'Partagé' : 'Personnel'}
            </span>
          )}
        </div>
      </div>

      {/* Month navigation — always visible */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={handlePrevMonth}
          aria-label="Mois précédent"
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] border border-black/10 transition-colors hover:bg-white"
          style={{ color: 'var(--stone)' }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="font-semibold text-sm min-w-[110px] text-center" style={{ color: 'var(--stone)' }}>
          {monthLabel}
        </span>
        <button
          onClick={handleNextMonth}
          aria-label="Mois suivant"
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-sm)] border border-black/10 transition-colors hover:bg-white"
          style={{ color: 'var(--stone)' }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      {isPending ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'var(--ocean)' }} />
          <p className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--mist)' }}>
            Chargement…
          </p>
        </div>
      ) : isError || !account ? (
        <div className="flex items-center justify-center p-12">
          <div
            className="rounded-[var(--radius-lg)] p-8 flex flex-col items-center gap-4"
            style={{ background: 'var(--coral-pale)', color: 'var(--coral)' }}
          >
            <p className="text-sm font-medium">Une erreur est survenue lors du chargement du compte.</p>
          </div>
        </div>
      ) : (
        <BankAccountDetailContent
          account={account}
          onAddBudget={handleAddBudget}
          onAddBudgetExpense={handleAddBudgetExpense}
          onAddCharge={handleAddCharge}
          onAddCredit={handleAddCredit}
          onAddExpense={handleAddExpense}
          isPendingBudget={addBudgetMutation.isPending}
          isPendingBudgetExpense={addBudgetExpenseMutation.isPending}
          isPendingCharge={addChargeMutation.isPending}
          isPendingCredit={addCreditMutation.isPending}
          isPendingExpense={addExpenseMutation.isPending}
        />
      )}
    </div>
  );
};
