import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ArrowLeft, Plus, Trash2, Check, ShoppingCart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
  ShoppingList,
  ShoppingListItem,
  CreateShoppingListItemInput,
  DesireLevel,
} from '../../../stores/shopping-lists/shopping-lists.types';

interface ShoppingListDetailProps {
  list: ShoppingList;
  onBack: () => void;
  onAddItem: (input: CreateShoppingListItemInput) => void;
  onToggleItem: (itemId: number, completed: boolean) => void;
  onDeleteItem: (itemId: number) => void;
  onClearCompleted: () => void;
}

const DESIRE_LEVEL_LABELS: Record<DesireLevel, string> = {
  REALLY_WANT: 'Vraiment envie',
  MAYBE: 'Peut-être',
  NOTED: 'Noté',
};

const DESIRE_LEVEL_STYLES: Record<DesireLevel, { bg: string; text: string }> = {
  REALLY_WANT: { bg: 'var(--coral-pale)', text: 'var(--coral)' },
  MAYBE:       { bg: 'var(--sun-pale)',   text: '#92400e' },
  NOTED:       { bg: 'var(--ocean-pale)', text: 'var(--ocean)' },
};

interface AddItemFormValues {
  title: string;
  shop: string;
  desireLevel: string;
}

interface ItemRowProps {
  item: ShoppingListItem;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

const ItemRow = ({ item, onToggle, onDelete }: ItemRowProps) => (
  <div className="flex items-center gap-3 py-3 group">
    {/* Custom checkbox */}
    <button
      type="button"
      className="flex-none w-5 h-5 rounded-[4px] border-2 flex items-center justify-center transition-all"
      style={
        item.completed
          ? { background: 'var(--sage)', borderColor: 'var(--sage)' }
          : { borderColor: 'rgba(0,0,0,0.2)', background: 'white' }
      }
      onClick={() => onToggle(item.id, !item.completed)}
      aria-label={item.completed ? 'Marquer comme non acheté' : 'Marquer comme acheté'}
    >
      {item.completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
    </button>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <span
        className="text-sm font-medium"
        style={item.completed ? { color: 'var(--mist)', textDecoration: 'line-through' } : { color: 'var(--stone)' }}
      >
        {item.title}
      </span>
      {(item.shop || item.desireLevel) && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {item.shop && (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
              style={{ background: 'var(--sand)', color: 'var(--mist)' }}
            >
              {item.shop}
            </span>
          )}
          {item.desireLevel && (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
              style={{ background: DESIRE_LEVEL_STYLES[item.desireLevel].bg, color: DESIRE_LEVEL_STYLES[item.desireLevel].text }}
            >
              {DESIRE_LEVEL_LABELS[item.desireLevel]}
            </span>
          )}
        </div>
      )}
    </div>

    {/* Delete */}
    <button
      type="button"
      className="flex-none p-1 rounded opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
      style={{ color: 'var(--coral)' }}
      onClick={() => onDelete(item.id)}
      aria-label="Supprimer l'article"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  </div>
);

export const ShoppingListDetail = ({
  list,
  onBack,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onClearCompleted,
}: ShoppingListDetailProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { control, handleSubmit, reset, formState: { isValid } } = useForm<AddItemFormValues>({
    mode: 'onChange',
    defaultValues: { title: '', shop: '', desireLevel: '' },
  });

  const handleAddItem = (values: AddItemFormValues) => {
    const input: CreateShoppingListItemInput = {
      title: values.title,
      shop: values.shop || undefined,
      desireLevel: (values.desireLevel as DesireLevel) || undefined,
    };
    onAddItem(input);
    reset();
    setIsAddOpen(false);
  };

  const handleCancelAdd = () => {
    reset();
    setIsAddOpen(false);
  };

  const activeItems = list.items.filter((item) => !item.completed);
  const completedItems = list.items.filter((item) => item.completed);
  const isShared = list.type === 'SHARED';
  const completedPct = list.items.length > 0
    ? Math.round((completedItems.length / list.items.length) * 100)
    : 0;

  return (
    <div className="p-4 md:p-8" style={{ background: 'var(--sand)', minHeight: '100%' }}>
      {/* Back + header */}
      <div className="flex items-start gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-[var(--radius-sm)] border border-black/10 transition-colors hover:bg-black/5 mt-0.5"
          style={{ color: 'var(--stone)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl md:text-3xl font-bold truncate" style={{ color: 'var(--stone)' }}>
            {list.name}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
              style={
                isShared
                  ? { background: 'var(--ocean-pale)', color: 'var(--ocean)' }
                  : { background: 'var(--sage-pale)', color: 'var(--sage)' }
              }
            >
              {isShared ? 'Partagée' : 'Personnelle'}
            </span>
            {list.items.length > 0 && (
              <span className="text-xs" style={{ color: 'var(--mist)' }}>
                {completedItems.length}/{list.items.length} articles · {completedPct}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {list.items.length > 0 && (
        <div className="mb-6">
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${completedPct}%`,
                background: completedPct === 100 ? 'var(--sage)' : 'linear-gradient(to right, var(--ocean), var(--ocean-light))',
              }}
            />
          </div>
        </div>
      )}

      {/* Main card */}
      <div className="bg-white rounded-[var(--radius-lg)] overflow-hidden" style={{ boxShadow: 'var(--shadow-soft)' }}>
        {/* Card header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
        >
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
            Articles
          </span>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold text-white transition-all hover:-translate-y-px"
            style={{
              background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
              boxShadow: '0 2px 8px rgba(27,79,138,0.25)',
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter un article
          </button>
        </div>

        {list.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'var(--ocean-pale)' }}
            >
              <ShoppingCart className="w-6 h-6" style={{ color: 'var(--ocean)' }} />
            </div>
            <p className="text-sm" style={{ color: 'var(--mist)' }}>Aucun article</p>
          </div>
        ) : (
          <div className="px-6">
            {/* Active items */}
            {activeItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ocean)' }}>
                    À acheter ({activeItems.length})
                  </span>
                </div>
                <div className="divide-y divide-black/[0.04]">
                  {activeItems.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      onToggle={onToggleItem}
                      onDelete={onDeleteItem}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed items */}
            {completedItems.length > 0 && (
              <div className={activeItems.length > 0 ? 'mt-2' : ''}>
                <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--sage)' }}>
                      Acheté ({completedItems.length})
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-medium px-2.5 py-1 rounded-[var(--radius-sm)] border transition-colors hover:bg-red-50"
                    style={{ borderColor: 'var(--coral)', color: 'var(--coral)' }}
                    onClick={onClearCompleted}
                  >
                    Nettoyer
                  </button>
                </div>
                <div className="divide-y divide-black/[0.04]">
                  {completedItems.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      onToggle={onToggleItem}
                      onDelete={onDeleteItem}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add item dialog */}
      <Dialog open={isAddOpen} onOpenChange={(o) => !o && handleCancelAdd()}>
        <DialogContent
          className="rounded-[var(--radius-md)] border-none sm:max-w-[420px]"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold" style={{ color: 'var(--stone)' }}>
              Ajouter un article
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
                    Article *
                  </Label>
                  <Input
                    {...field}
                    placeholder="Ex : Pain"
                    className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0"
                    style={{ background: 'var(--sand)' }}
                  />
                </div>
              )}
            />

            <Controller
              name="shop"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                    Magasin
                  </Label>
                  <Input
                    {...field}
                    placeholder="Ex : Intermarché, Marché, Picard..."
                    className="rounded-[var(--radius-sm)] border-black/10 focus-visible:ring-0"
                    style={{ background: 'var(--sand)' }}
                  />
                </div>
              )}
            />

            <Controller
              name="desireLevel"
              control={control}
              render={({ field }) => (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--mist)' }}>
                    Niveau d'envie
                  </Label>
                  <select
                    {...field}
                    className="w-full h-10 px-3 text-sm rounded-[var(--radius-sm)] border border-black/10 focus:outline-none"
                    style={{ background: 'var(--sand)', color: 'var(--stone)' }}
                  >
                    <option value="">Sélectionner un niveau</option>
                    <option value="REALLY_WANT">{DESIRE_LEVEL_LABELS.REALLY_WANT}</option>
                    <option value="MAYBE">{DESIRE_LEVEL_LABELS.MAYBE}</option>
                    <option value="NOTED">{DESIRE_LEVEL_LABELS.NOTED}</option>
                  </select>
                </div>
              )}
            />

            <DialogFooter className="pt-2">
              <button
                type="button"
                className="text-sm font-medium px-4 py-2 rounded-[var(--radius-sm)] border border-black/10 transition-colors hover:bg-black/5"
                style={{ color: 'var(--stone)' }}
                onClick={handleCancelAdd}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className="text-sm font-semibold text-white px-5 py-2 rounded-[var(--radius-sm)] transition-all hover:-translate-y-px disabled:opacity-50 disabled:translate-y-0"
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
    </div>
  );
};
