import { Controller, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreateBudgetInput } from '../../../stores/bank-accounts/bank-accounts.types';

interface AddBudgetDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateBudgetInput) => void;
  isPending: boolean;
}

interface FormValues {
  name: string;
  initialAmount: number;
}

export const AddBudgetDialog = ({ open, onClose, onSubmit, isPending }: AddBudgetDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { name: '', initialAmount: 0 },
  });

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({ name: values.name, initialAmount: Number(values.initialAmount) });
    reset();
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleCancel()}>
      <DialogContent
        className="rounded-[var(--radius-md)] border-none sm:max-w-[440px]"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold" style={{ color: 'var(--stone)' }}>
            Nouveau budget
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 pt-2">
          <Controller
            name="name"
            control={control}
            rules={{ required: true, validate: (v) => v.trim().length > 0 }}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Nom du budget *
                </Label>
                <Input
                  {...field}
                  placeholder="Ex : Alimentation"
                  className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0"
                  style={{ background: 'var(--sand)' }}
                />
              </div>
            )}
          />

          <Controller
            name="initialAmount"
            control={control}
            rules={{ required: true, min: 0 }}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Montant initial (€) *
                </Label>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0"
                  style={{ background: 'var(--sand)' }}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </div>
            )}
          />

          <DialogFooter className="pt-2">
            <button
              type="button"
              className="text-sm font-medium px-4 py-2 rounded-[var(--radius-sm)] border border-black/10 transition-colors hover:bg-black/5"
              style={{ color: 'var(--stone)' }}
              onClick={handleCancel}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!isValid || isPending}
              className="text-sm font-semibold text-white px-5 py-2 rounded-[var(--radius-sm)] transition-all duration-150 hover:-translate-y-px disabled:opacity-50 disabled:translate-y-0"
              style={{
                background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
                boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
              }}
            >
              {isPending ? 'Ajout...' : 'Ajouter'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
