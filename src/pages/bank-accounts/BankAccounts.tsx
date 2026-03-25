import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  useFetchAllBankAccounts,
  useCreateBankAccount,
} from '../../stores/bank-accounts/bank-accounts.queries';
import type { CreateBankAccountInput } from '../../stores/bank-accounts/bank-accounts.types';
import { BankAccountsView } from './components/BankAccountsView';
import { CreateBankAccountDialog } from './components/CreateBankAccountDialog';
import { BankAccountDetail } from './components/BankAccountDetail';

export const BankAccounts = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: accounts, isPending, isError } = useFetchAllBankAccounts();
  const createMutation = useCreateBankAccount();

  const handleCreate = (input: CreateBankAccountInput) => {
    createMutation.mutate(input, {
      onSuccess: () => {
        toast({ title: 'Compte bancaire créé avec succès' });
        setIsCreateOpen(false);
      },
      onError: () => {
        toast({ title: 'Erreur lors de la création du compte', variant: 'destructive' });
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 min-h-full" style={{ background: 'var(--sand)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--ocean)' }} />
        <p className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--mist)' }}>
          Chargement des comptes...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-12 min-h-full" style={{ background: 'var(--sand)' }}>
        <div
          className="rounded-[var(--radius-lg)] p-8 flex flex-col items-center gap-4"
          style={{ background: 'var(--coral-pale)', color: 'var(--coral)' }}
        >
          <p className="text-sm font-medium">Une erreur est survenue lors du chargement.</p>
        </div>
      </div>
    );
  }

  if (selectedAccountId !== null) {
    return (
      <BankAccountDetail
        accountId={selectedAccountId}
        onBack={() => setSelectedAccountId(null)}
      />
    );
  }

  return (
    <>
      <BankAccountsView
        accounts={accounts ?? []}
        onSelect={setSelectedAccountId}
        onCreate={() => setIsCreateOpen(true)}
      />
      <CreateBankAccountDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
      />
    </>
  );
};
