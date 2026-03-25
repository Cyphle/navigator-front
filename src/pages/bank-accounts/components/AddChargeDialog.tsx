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
import { cn } from '@/lib/utils';
import type { ChargePeriodicity, CreateChargeInput } from '../../../stores/bank-accounts/bank-accounts.types';

interface AddChargeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateChargeInput) => void;
  isPending: boolean;
}

interface FormValues {
  description: string;
  amount: number;
  debitDate: string;
  periodicity: ChargePeriodicity;
}

const today = new Date().toISOString().split('T')[0];

export const AddChargeDialog = ({ open, onClose, onSubmit, isPending }: AddChargeDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { description: '', amount: 0, debitDate: today, periodicity: 'MONTHLY' },
  });

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      description: values.description,
      amount: Number(values.amount),
      debitDate: values.debitDate,
      periodicity: values.periodicity,
    });
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
            Nouvelle charge
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 pt-2">
          <Controller
            name="description"
            control={control}
            rules={{ required: true, validate: (v) => v.trim().length > 0 }}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Description *
                </Label>
                <Input
                  {...field}
                  placeholder="Ex : Loyer"
                  className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0"
                  style={{ background: 'var(--sand)' }}
                />
              </div>
            )}
          />

          <Controller
            name="amount"
            control={control}
            rules={{ required: true, min: 0.01 }}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Montant (€) *
                </Label>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0"
                  style={{ background: 'var(--sand)' }}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </div>
            )}
          />

          <Controller
            name="debitDate"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Date de débit *
                </Label>
                <Input
                  {...field}
                  type="date"
                  className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0"
                  style={{ background: 'var(--sand)' }}
                />
              </div>
            )}
          />

          <Controller
            name="periodicity"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Périodicité
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {(['MONTHLY', 'YEARLY'] as ChargePeriodicity[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={cn(
                        'px-4 py-2.5 rounded-[var(--radius-sm)] border text-sm font-semibold transition-all',
                        field.value === p
                          ? 'text-white border-transparent'
                          : 'border-black/10 hover:border-[var(--ocean-light)]'
                      )}
                      style={
                        field.value === p
                          ? { background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)', color: 'white' }
                          : { color: 'var(--stone)' }
                      }
                      onClick={() => field.onChange(p)}
                    >
                      {p === 'MONTHLY' ? 'Mensuelle' : 'Annuelle'}
                    </button>
                  ))}
                </div>
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
