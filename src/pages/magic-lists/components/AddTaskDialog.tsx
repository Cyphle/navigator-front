import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { CreateMagicItemInput, MagicItemStatus, MagicListType } from '../../../stores/magic-lists/magic-lists.types';

const STATUS_OPTIONS: { value: MagicItemStatus; label: string }[] = [
  { value: 'TODO', label: 'À faire' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'DONE', label: 'Terminé' },
];

interface AddItemFormValues {
  title: string;
  content: string;
  checked: boolean;
  dueDate: string;
  status: MagicItemStatus | '';
}

interface AddTaskDialogProps {
  open: boolean;
  listType: MagicListType;
  onClose: () => void;
  onSubmit: (input: CreateMagicItemInput) => void;
}

export const AddTaskDialog = ({ open, listType, onClose, onSubmit }: AddTaskDialogProps) => {
  const [showAdditional, setShowAdditional] = useState(false);

  const { control, handleSubmit, reset, formState: { isValid } } = useForm<AddItemFormValues>({
    mode: 'onChange',
    defaultValues: { title: '', content: '', checked: false, dueDate: '', status: '' },
  });

  const handleAddItem = (values: AddItemFormValues) => {
    const input: CreateMagicItemInput = {
      title: values.title,
      content: values.content || undefined,
      checked: listType === 'TASK' ? values.checked : undefined,
      dueDate: values.dueDate ? dayjs(values.dueDate).toISOString() : undefined,
      status: values.status || undefined,
    };
    onSubmit(input);
    reset();
    setShowAdditional(false);
    onClose();
  };

  const handleClose = () => {
    reset();
    setShowAdditional(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="rounded-[var(--radius-md)] border-none" style={{ boxShadow: 'var(--shadow-card)' }}>
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold" style={{ color: 'var(--stone)' }}>
            Ajouter un élément
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleAddItem)} className="space-y-4 pt-2">
          {/* Title */}
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
                  placeholder="Ex : Acheter du lait"
                  className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0"
                  style={{ background: 'var(--sand)' }}
                />
              </div>
            )}
          />

          {/* Content */}
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Contenu
                </Label>
                <Textarea
                  {...field}
                  placeholder="Détails, notes..."
                  className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0 resize-none min-h-[72px]"
                  style={{ background: 'var(--sand)' }}
                />
              </div>
            )}
          />

          {/* Checkbox — TASK lists only */}
          {listType === 'TASK' && (
            <Controller
              name="checked"
              control={control}
              render={({ field }) => (
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(v) => field.onChange(Boolean(v))}
                  />
                  <span className="text-sm font-medium" style={{ color: 'var(--stone)' }}>
                    Déjà réalisé
                  </span>
                </label>
              )}
            />
          )}

          {/* Collapsible additional fields */}
          <div className="rounded-[var(--radius-sm)] border border-black/8 overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide transition-colors hover:bg-black/5"
              style={{ color: 'var(--mist)' }}
              onClick={() => setShowAdditional((v) => !v)}
            >
              {showAdditional ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              Champs additionnels
            </button>

            {showAdditional && (
              <div className="px-3 pb-3 pt-1 space-y-3 border-t border-black/8" style={{ background: 'var(--sand)' }}>
                {/* Due date */}
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
                        style={{ background: 'white' }}
                      />
                    </div>
                  )}
                />

                {/* Status */}
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
                        style={{ background: 'white', color: 'var(--stone)' }}
                      >
                        <option value="">Aucun</option>
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                />
              </div>
            )}
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
