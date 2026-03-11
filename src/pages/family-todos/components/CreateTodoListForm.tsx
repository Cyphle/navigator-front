import { useState } from 'react';
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
import type { CreateTodoListInput, TodoListType } from '../../../stores/family-todos/family-todos.types';
import type { Family } from '../../../stores/families/families.types';

interface CreateTodoListFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (input: CreateTodoListInput) => void;
  isLoading?: boolean;
  families: Family[];
}

interface FormValues {
  name: string;
  type: TodoListType;
  familyId?: number;
}

export const CreateTodoListForm = ({
  open,
  onCancel,
  onSubmit,
  isLoading,
  families,
}: CreateTodoListFormProps) => {
  const { control, handleSubmit, reset, formState: { isValid } } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: { name: '', type: 'PERSONAL' },
  });
  const [listType, setListType] = useState<TodoListType>('PERSONAL');

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      name: values.name,
      type: values.type,
      familyId: values.type === 'SHARED' ? values.familyId : undefined,
    });
    reset();
    setListType('PERSONAL');
  };

  const handleCancel = () => {
    reset();
    setListType('PERSONAL');
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleCancel()}>
      <DialogContent className="rounded-[var(--radius-md)] border-none sm:max-w-[440px]" style={{ boxShadow: 'var(--shadow-card)' }}>
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold" style={{ color: 'var(--stone)' }}>
            Nouvelle liste de todos
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
                  Nom de la liste *
                </Label>
                <Input
                  {...field}
                  placeholder="Ex : Tâches ménagères"
                  className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0"
                  style={{ background: 'var(--sand)' }}
                />
              </div>
            )}
          />

          {/* Type radio buttons */}
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                  Type de liste
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {(['PERSONAL', 'SHARED'] as TodoListType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={cn(
                        'px-4 py-2.5 rounded-[var(--radius-sm)] border text-sm font-semibold transition-all',
                        field.value === t
                          ? 'text-white border-transparent'
                          : 'border-black/10 hover:border-[var(--ocean-light)]'
                      )}
                      style={
                        field.value === t
                          ? { background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)', color: 'white' }
                          : { color: 'var(--stone)' }
                      }
                      onClick={() => {
                        field.onChange(t);
                        setListType(t);
                      }}
                    >
                      {t === 'PERSONAL' ? 'Personnelle' : 'Partagée'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          />

          {/* Family selector (SHARED only) */}
          {listType === 'SHARED' && families.length > 0 && (
            <Controller
              name="familyId"
              control={control}
              rules={{ required: listType === 'SHARED' }}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                    Famille *
                  </Label>
                  <select
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="w-full h-10 px-3 text-sm rounded-[var(--radius-sm)] border border-black/10 focus:outline-none"
                    style={{ background: 'var(--sand)', color: 'var(--stone)' }}
                  >
                    <option value="">Sélectionner une famille</option>
                    {families.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              )}
            />
          )}

          {listType === 'SHARED' && families.length === 0 && (
            <p className="text-sm rounded-[var(--radius-sm)] px-4 py-3" style={{ background: 'var(--sun-pale)', color: 'var(--stone)' }}>
              Vous n'avez aucune famille. Créez-en une dans la section Familles.
            </p>
          )}

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
              className="text-sm font-semibold text-white px-5 py-2 rounded-[var(--radius-sm)] transition-all duration-150 hover:-translate-y-px disabled:opacity-50 disabled:translate-y-0"
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
