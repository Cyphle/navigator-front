import { Controller, useForm } from 'react-hook-form';
import dayjs, { type Dayjs } from 'dayjs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreateMealsListInput } from '../../../stores/meals/meals.types';

interface MealsListFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (input: CreateMealsListInput) => void;
  isLoading?: boolean;
}

const RANGE_OPTIONS = [
  { value: 7, label: '1 semaine' },
  { value: 14, label: '2 semaines' },
  { value: 21, label: '3 semaines' },
  { value: 30, label: '1 mois' },
];

interface FormValues {
  name: string;
  startDate: string;
  range: number;
}

export const MealsListForm = ({ open, onCancel, onSubmit, isLoading }: MealsListFormProps) => {
  const { control, handleSubmit, reset, watch, formState: { isValid } } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { name: '', startDate: dayjs().format('YYYY-MM-DD'), range: 7 },
  });

  const startDate = watch('startDate');
  const range = watch('range');

  const endDate: Dayjs | null = startDate ? dayjs(startDate).add(Number(range), 'day') : null;

  const handleFormSubmit = (values: FormValues) => {
    const end = dayjs(values.startDate).add(Number(values.range), 'day');
    onSubmit({
      name: values.name,
      startDate: values.startDate,
      endDate: end.format('YYYY-MM-DD'),
    });
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleCancel()}>
      <DialogContent className="rounded-[var(--radius-md)] border-none sm:max-w-[440px]" style={{ boxShadow: 'var(--shadow-card)' }}>
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold" style={{ color: 'var(--stone)' }}>
            Nouvelle liste de menus planifiés
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 pt-2">
          <Controller
            name="name"
            control={control}
            rules={{ required: true, validate: (v) => v.trim().length > 0 }}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label htmlFor="planned-menu-name" className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Nom de la liste *
                </Label>
                <Input
                  {...field}
                  id="planned-menu-name"
                  placeholder="Ex : Menu de la semaine"
                  className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0"
                  style={{ background: 'var(--sand)' }}
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
                <Label htmlFor="planned-menu-start-date" className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Date de début *
                </Label>
                <Input
                  {...field}
                  id="planned-menu-start-date"
                  type="date"
                  className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0"
                  style={{ background: 'var(--sand)' }}
                />
              </div>
            )}
          />

          <Controller
            name="range"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Durée
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {RANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className="py-2 text-xs font-semibold rounded-[var(--radius-sm)] border transition-all"
                      style={
                        Number(field.value) === opt.value
                          ? { background: 'var(--ocean-pale)', borderColor: 'var(--ocean)', color: 'var(--ocean)' }
                          : { borderColor: 'rgba(0,0,0,0.1)', color: 'var(--mist)' }
                      }
                      onClick={() => field.onChange(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          />

          {/* End date preview as disabled input */}
          <div className="space-y-1.5">
            <Label htmlFor="planned-menu-end-date" className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
              Date de fin
            </Label>
            <Input
              id="planned-menu-end-date"
              type="text"
              disabled
              readOnly
              value={endDate ? endDate.format('DD/MM/YYYY') : ''}
              className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0 opacity-70"
              style={{ background: 'var(--ocean-pale)', color: 'var(--ocean)' }}
            />
          </div>

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
              disabled={!isValid || isLoading}
              className="text-sm font-semibold text-white px-5 py-2 rounded-[var(--radius-sm)] transition-all hover:-translate-y-px disabled:opacity-50 disabled:translate-y-0"
              style={{
                background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
                boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
              }}
            >
              {isLoading ? 'Création...' : 'Créer'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
