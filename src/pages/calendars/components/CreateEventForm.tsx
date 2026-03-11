import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreateCalendarEventInput, Calendar } from '../../../stores/calendars/calendars.types';

interface CreateEventFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (input: CreateCalendarEventInput) => void;
  isLoading?: boolean;
  eventId?: number | null;
  calendars: Calendar[];
  selectedCalendarId: number | null;
}

const RECURRENCE_OPTIONS = [
  { value: 'NONE', label: 'Aucune' },
  { value: 'DAILY', label: 'Quotidienne' },
  { value: 'WEEKLY', label: 'Hebdomadaire' },
  { value: 'MONTHLY', label: 'Mensuelle' },
  { value: 'YEARLY', label: 'Annuelle' },
];

interface FormValues {
  title: string;
  description: string;
  invites: string;
  date: string;
  time: string;
  duration: number;
  recurrence: string;
}

export const CreateEventForm = ({
  open,
  onCancel,
  onSubmit,
  isLoading,
  calendars,
  selectedCalendarId,
}: CreateEventFormProps) => {
  const { control, handleSubmit, reset, formState: { isValid } } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      invites: '',
      date: dayjs().format('YYYY-MM-DD'),
      time: '09:00',
      duration: 60,
      recurrence: 'NONE',
    },
  });

  const selectedCalendar = calendars.find((c) => c.id === selectedCalendarId);

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      title: values.title,
      description: values.description || undefined,
      invites: values.invites ? values.invites.split(',').map((e) => e.trim()).filter(Boolean) : undefined,
      date: values.date,
      time: values.time,
      duration: Number(values.duration),
      recurrence: values.recurrence as CreateCalendarEventInput['recurrence'],
    });
    reset();
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleCancel()}>
      <DialogContent className="rounded-[var(--radius-md)] border-none sm:max-w-[480px]" style={{ boxShadow: 'var(--shadow-card)' }}>
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold" style={{ color: 'var(--stone)' }}>
            Nouvel événement
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
          {/* Calendar indicator */}
          {selectedCalendar && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-sm)]"
              style={{ background: `${selectedCalendar.color}18` }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: selectedCalendar.color }} />
              <span className="text-xs font-semibold" style={{ color: selectedCalendar.color }}>
                {selectedCalendar.name}
              </span>
            </div>
          )}

          <Controller
            name="title"
            control={control}
            rules={{ required: true, validate: (v) => v.trim().length > 0 }}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Titre *
                </Label>
                <Input {...field} placeholder="Ex : Réunion d'équipe" className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0" style={{ background: 'var(--sand)' }} />
              </div>
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Description
                </Label>
                <Input {...field} placeholder="Description de l'événement" className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0" style={{ background: 'var(--sand)' }} />
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="date"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                    Date *
                  </Label>
                  <Input {...field} type="date" className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0" style={{ background: 'var(--sand)' }} />
                </div>
              )}
            />
            <Controller
              name="time"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                    Heure *
                  </Label>
                  <Input {...field} type="time" className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0" style={{ background: 'var(--sand)' }} />
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="duration"
              control={control}
              rules={{ required: true, min: 15 }}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                    Durée (min)
                  </Label>
                  <Input {...field} type="number" min={15} step={15} className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0" style={{ background: 'var(--sand)' }} />
                </div>
              )}
            />
            <Controller
              name="recurrence"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                    Récurrence
                  </Label>
                  <select
                    {...field}
                    className="w-full h-10 px-3 text-sm rounded-[var(--radius-sm)] border border-black/10 focus:outline-none"
                    style={{ background: 'var(--sand)', color: 'var(--stone)' }}
                  >
                    {RECURRENCE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              )}
            />
          </div>

          <Controller
            name="invites"
            control={control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Invités (emails séparés par des virgules)
                </Label>
                <Input {...field} placeholder="email1@example.com, email2@example.com" className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0" style={{ background: 'var(--sand)' }} />
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
