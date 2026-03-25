import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  BankAccountMonthView,
  CreateBudgetInput,
  CreateBudgetExpenseInput,
  CreateChargeInput,
  CreateCreditInput,
  CreateExpenseInput,
} from '../../../stores/bank-accounts/bank-accounts.types';
import { BudgetsSection } from './BudgetsSection';
import { ChargesSection } from './ChargesSection';
import { CreditsSection } from './CreditsSection';
import { ExpensesSection } from './ExpensesSection';
import { TransactionsSection } from './TransactionsSection';
import { AddBudgetDialog } from './AddBudgetDialog';
import { AddBudgetExpenseDialog } from './AddBudgetExpenseDialog';
import { AddChargeDialog } from './AddChargeDialog';
import { AddCreditDialog } from './AddCreditDialog';
import { AddExpenseDialog } from './AddExpenseDialog';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

interface BankAccountDetailContentProps {
  account: BankAccountMonthView;
  onAddBudget: (input: CreateBudgetInput) => void;
  onAddBudgetExpense: (budgetId: number, input: CreateBudgetExpenseInput) => void;
  onAddCharge: (input: CreateChargeInput) => void;
  onAddCredit: (input: CreateCreditInput) => void;
  onAddExpense: (input: CreateExpenseInput) => void;
  isPendingBudget: boolean;
  isPendingBudgetExpense: boolean;
  isPendingCharge: boolean;
  isPendingCredit: boolean;
  isPendingExpense: boolean;
}

export const BankAccountDetailContent = ({
  account,
  onAddBudget,
  onAddBudgetExpense,
  onAddCharge,
  onAddCredit,
  onAddExpense,
  isPendingBudget,
  isPendingBudgetExpense,
  isPendingCharge,
  isPendingCredit,
  isPendingExpense,
}: BankAccountDetailContentProps) => {
  const [addBudgetOpen, setAddBudgetOpen] = useState(false);
  const [addBudgetExpenseOpen, setAddBudgetExpenseOpen] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);
  const [addChargeOpen, setAddChargeOpen] = useState(false);
  const [addCreditOpen, setAddCreditOpen] = useState(false);
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);

  const handleOpenBudgetExpense = (budgetId: number) => {
    setSelectedBudgetId(budgetId);
    setAddBudgetExpenseOpen(true);
  };

  const handleBudgetExpenseSubmit = (input: CreateBudgetExpenseInput) => {
    if (selectedBudgetId !== null) {
      onAddBudgetExpense(selectedBudgetId, input);
    }
  };

  return (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-[var(--radius-lg)] p-5" style={{ boxShadow: 'var(--shadow-soft)' }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--mist)' }}>
            Montant initial
          </p>
          <p className="font-display text-2xl font-bold" style={{ color: 'var(--stone)' }}>
            {formatCurrency(account.startingAmount)}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--mist)' }}>
            Solde de départ du compte
          </p>
        </div>

        <div className="bg-white rounded-[var(--radius-lg)] p-5" style={{ boxShadow: 'var(--shadow-soft)' }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--mist)' }}>
            Montant restant
          </p>
          <p
            className="font-display text-2xl font-bold"
            style={{ color: account.remainingAmount >= 0 ? 'var(--stone)' : 'var(--coral)' }}
          >
            {formatCurrency(account.remainingAmount)}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--mist)' }}>
            Après allocation des budgets et charges
          </p>
        </div>

        <div className="bg-white rounded-[var(--radius-lg)] p-5" style={{ boxShadow: 'var(--shadow-soft)' }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--mist)' }}>
            Montant actuel
          </p>
          <p
            className="font-display text-2xl font-bold"
            style={{ color: account.actualAmount >= 0 ? 'var(--ocean)' : 'var(--coral)' }}
          >
            {formatCurrency(account.actualAmount)}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--mist)' }}>
            Après dépenses réelles sur budgets
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="budgets">
        <TabsList className="mb-4 bg-white rounded-[var(--radius-sm)]" style={{ boxShadow: 'var(--shadow-soft)' }}>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="charges">Charges</TabsTrigger>
          <TabsTrigger value="credits">Crédits</TabsTrigger>
          <TabsTrigger value="expenses">Dépenses</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="budgets">
          <BudgetsSection
            budgets={account.budgets}
            onAddBudget={() => setAddBudgetOpen(true)}
            onAddExpense={handleOpenBudgetExpense}
          />
        </TabsContent>

        <TabsContent value="charges">
          <ChargesSection charges={account.charges} onAdd={() => setAddChargeOpen(true)} />
        </TabsContent>

        <TabsContent value="credits">
          <CreditsSection credits={account.credits} onAdd={() => setAddCreditOpen(true)} />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpensesSection expenses={account.expenses} onAdd={() => setAddExpenseOpen(true)} />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsSection account={account} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AddBudgetDialog
        open={addBudgetOpen}
        onClose={() => setAddBudgetOpen(false)}
        onSubmit={onAddBudget}
        isPending={isPendingBudget}
      />

      <AddBudgetExpenseDialog
        open={addBudgetExpenseOpen}
        onClose={() => {
          setAddBudgetExpenseOpen(false);
          setSelectedBudgetId(null);
        }}
        onSubmit={handleBudgetExpenseSubmit}
        isPending={isPendingBudgetExpense}
      />

      <AddChargeDialog
        open={addChargeOpen}
        onClose={() => setAddChargeOpen(false)}
        onSubmit={onAddCharge}
        isPending={isPendingCharge}
      />

      <AddCreditDialog
        open={addCreditOpen}
        onClose={() => setAddCreditOpen(false)}
        onSubmit={onAddCredit}
        isPending={isPendingCredit}
      />

      <AddExpenseDialog
        open={addExpenseOpen}
        onClose={() => setAddExpenseOpen(false)}
        onSubmit={onAddExpense}
        isPending={isPendingExpense}
      />
    </>
  );
};
