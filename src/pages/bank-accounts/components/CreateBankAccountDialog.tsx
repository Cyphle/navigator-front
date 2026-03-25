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
import type { AccountVisibility, CreateBankAccountInput } from '../../../stores/bank-accounts/bank-accounts.types';

interface CreateBankAccountDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateBankAccountInput) => void;
  isPending: boolean;
}

interface FormValues {
  name: string;
  startingAmount: number;
  startDate: string;
  visibility: AccountVisibility;
}

const today = new Date().toISOString().split('T')[0];

export const CreateBankAccountDialog = ({
  open,
  onClose,
  onSubmit,
  isPending,
}: CreateBankAccountDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      startingAmount: 0,
      startDate: today,
      visibility: 'SHARED',
    },
  });

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      name: values.name,
      startingAmount: Number(values.startingAmount),
      startDate: values.startDate,
      visibility: values.visibility,
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
            Nouveau compte bancaire
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
                  Nom du compte *
                </Label>
                <Input
                  {...field}
                  placeholder="Ex : Compte courant"
                  className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0"
                  style={{ background: 'var(--sand)' }}
                />
              </div>
            )}
          />

          <Controller
            name="startingAmount"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Montant de départ (€) *
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

          <Controller
            name="startDate"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Date de départ *
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
            name="visibility"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Visibilité
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {(['SHARED', 'PERSONAL'] as AccountVisibility[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={cn(
                        'px-4 py-2.5 rounded-[var(--radius-sm)] border text-sm font-semibold transition-all',
                        field.value === v
                          ? 'text-white border-transparent'
                          : 'border-black/10 hover:border-[var(--ocean-light)]'
                      )}
                      style={
                        field.value === v
                          ? { background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)', color: 'white' }
                          : { color: 'var(--stone)' }
                      }
                      onClick={() => field.onChange(v)}
                    >
                      {v === 'SHARED' ? 'Partagé' : 'Personnel'}
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
              {isPending ? 'Création...' : 'Créer'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
