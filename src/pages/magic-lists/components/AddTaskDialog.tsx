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
import type { CreateMagicItemInput, MagicItemStatus } from '../../../stores/magic-lists/magic-lists.types';

const STATUS_LABELS: Record<MagicItemStatus, string> = {
  TODO: 'À faire',
  IN_PROGRESS: 'En cours',
  DONE: 'Terminé',
};

interface AddItemFormValues {
  title: string;
  description: string;
  dueDate: string;
  status: MagicItemStatus;
}

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateMagicItemInput) => void;
}

export const AddTaskDialog = ({ open, onClose, onSubmit }: AddTaskDialogProps) => {
  const { control, handleSubmit, reset, formState: { isValid } } = useForm<AddItemFormValues>({
    mode: 'onChange',
    defaultValues: { title: '', description: '', dueDate: '', status: 'TODO' },
  });

  const handleAddItem = (values: AddItemFormValues) => {
    const input: CreateMagicItemInput = {
      title: values.title,
      description: values.description || undefined,
      dueDate: values.dueDate ? dayjs(values.dueDate).toISOString() : undefined,
      status: values.status,
    };
    onSubmit(input);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="rounded-[var(--radius-md)] border-none" style={{ boxShadow: 'var(--shadow-card)' }}>
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold" style={{ color: 'var(--stone)' }}>
            Ajouter une tâche
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleAddItem)} className="space-y-4 pt-2">
          <Controller
            name="title"
            control={control}
            rules={{ required: true, validate: (v) => v.trim().length > 0 }}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Titre *
                </Label>
                <Input
                  {...field}
                  placeholder="Ex : Faire les courses"
                  className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0"
                  style={{ background: 'var(--sand)' }}
                />
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
                <Input
                  {...field}
                  placeholder="Détails de la tâche..."
                  className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0"
                  style={{ background: 'var(--sand)' }}
                />
              </div>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                    Échéance
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
              name="status"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                    Statut
                  </Label>
                  <select
                    {...field}
                    className="w-full h-10 px-3 text-sm rounded-[var(--radius-sm)] border border-black/10 focus:outline-none"
                    style={{ background: 'var(--sand)', color: 'var(--stone)' }}
                  >
                    {(Object.keys(STATUS_LABELS) as MagicItemStatus[]).map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              )}
            />
          </div>

          <DialogFooter className="pt-2">
            <button
              type="button"
              className="text-sm font-medium px-4 py-2 rounded-[var(--radius-sm)] border border-black/10 transition-colors hover:bg-black/5"
              style={{ color: 'var(--stone)' }}
              onClick={handleClose}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="text-sm font-semibold text-white px-5 py-2 rounded-[var(--radius-sm)] transition-all duration-150 hover:-translate-y-px disabled:opacity-50 disabled:translate-y-0"
              style={{
                background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
                boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
              }}
            >
              Ajouter
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
