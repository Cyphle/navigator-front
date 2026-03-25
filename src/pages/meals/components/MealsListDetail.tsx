import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { ArrowLeft, Plus, Trash2, Calendar, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { MealsList, MealsRecipe } from '../../../stores/meals/meals.types';
import type { RecipeCategory } from '../../../stores/recipes/recipes.types';
import { useFetchRecipesPage } from '../../../stores/recipes/recipes.queries';

interface MealsListDetailProps {
  list: MealsList;
  onBack: () => void;
  onAddRecipe: (recipeId: number, recipeName: string, assignedDays?: string[]) => void;
  onRemoveRecipe: (recipeId: number) => void;
  onUpdateRecipeDays: (recipeId: number, recipeName: string, assignedDays?: string[]) => void;
}

const CATEGORY_LABELS: Record<RecipeCategory, string> = {
  ENTREE: 'Entrée',
  PLAT: 'Plat',
  DESSERT: 'Dessert',
  SAUCE: 'Sauce',
  APERO: 'Apéro',
};

const CATEGORY_COLORS: Record<RecipeCategory, { bg: string; text: string }> = {
  PLAT:    { bg: 'var(--sage-pale)',  text: 'var(--sage)' },
  DESSERT: { bg: 'var(--coral-pale)', text: 'var(--coral)' },
  ENTREE:  { bg: 'var(--sun-pale)',   text: 'var(--sun)' },
  SAUCE:   { bg: 'var(--ocean-pale)', text: 'var(--ocean)' },
  APERO:   { bg: 'var(--ocean-pale)', text: 'var(--ocean)' },
};

export const MealsListDetail = ({
  list,
  onBack,
  onAddRecipe,
  onRemoveRecipe,
  onUpdateRecipeDays,
}: MealsListDetailProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecipeForDays, setSelectedRecipeForDays] = useState<MealsRecipe | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | RecipeCategory>('ALL');
  const [minRating, setMinRating] = useState<string>('ALL');
  const [sort, setSort] = useState('NAME_ASC');

  const recipesQuery = useFetchRecipesPage(
    page,
    pageSize,
    categoryFilter === 'ALL' ? undefined : categoryFilter,
    undefined,
    minRating !== 'ALL' ? Number(minRating) : undefined,
    sort
  );

  const { data, isPending } = recipesQuery;
  const recipes = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  const selectedRecipeIds = useMemo(
    () => new Set(list.recipes.map((r) => r.recipeId)),
    [list.recipes]
  );

  const listDates = useMemo(() => {
    const dates: { value: string; label: string }[] = [];
    const start = dayjs(list.startDate);
    const end = dayjs(list.endDate);
    let current = start;
    while (current.isBefore(end) || current.isSame(end)) {
      dates.push({ value: current.format('YYYY-MM-DD'), label: current.format('dddd DD/MM') });
      current = current.add(1, 'day');
    }
    return dates;
  }, [list.startDate, list.endDate]);

  const handleOpenDaysModal = (recipe: MealsRecipe) => {
    setSelectedRecipeForDays(recipe);
    setSelectedDays(recipe.assignedDays || []);
  };

  const handleSaveDays = () => {
    if (selectedRecipeForDays) {
      onUpdateRecipeDays(
        selectedRecipeForDays.recipeId,
        selectedRecipeForDays.recipeName,
        selectedDays.length > 0 ? selectedDays : undefined
      );
    }
    setSelectedRecipeForDays(null);
    setSelectedDays([]);
  };

  return (
    <div className="p-4 md:p-6 min-h-full" style={{ background: 'var(--sand)' }}>
      {/* Back + header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <button
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70 shrink-0"
          style={{ color: 'var(--ocean)' }}
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl font-bold m-0 truncate" style={{ color: 'var(--stone)' }}>
            {list.name}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--mist)' }} />
            <p className="text-xs m-0" style={{ color: 'var(--mist)' }}>
              {dayjs(list.startDate).format('DD/MM/YYYY')} – {dayjs(list.endDate).format('DD/MM/YYYY')}
            </p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)] shrink-0 transition-all hover:-translate-y-px"
          style={{
            background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
            boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
          }}
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Ajouter une recette
        </button>
      </div>

      {/* Selected recipes */}
      <div className="bg-white rounded-[var(--radius-lg)] overflow-hidden" style={{ boxShadow: 'var(--shadow-soft)' }}>
        <div className="px-5 py-4 border-b border-black/5 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold m-0" style={{ color: 'var(--stone)' }}>
            Recettes sélectionnées
          </h3>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'var(--ocean-pale)', color: 'var(--ocean)' }}
          >
            {list.recipes.length}
          </span>
        </div>

        {list.recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <p className="text-sm font-medium" style={{ color: 'var(--mist)' }}>Aucune recette sélectionnée</p>
            <button
              className="text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)] border transition-colors hover:bg-[var(--ocean-pale)]"
              style={{ borderColor: 'var(--ocean)', color: 'var(--ocean)' }}
              onClick={() => setIsAddModalOpen(true)}
            >
              Ajouter la première recette
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-black/5 list-none p-0 m-0">
            {list.recipes.map((recipe) => (
              <li key={recipe.recipeId} className="flex items-center gap-3 px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold m-0 truncate" style={{ color: 'var(--stone)' }}>
                    {recipe.recipeName}
                  </p>
                  {recipe.assignedDays && recipe.assignedDays.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {recipe.assignedDays.map((d) => (
                        <span
                          key={d}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--ocean-pale)', color: 'var(--ocean)' }}
                        >
                          {dayjs(d).format('ddd DD/MM')}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs m-0 mt-0.5" style={{ color: 'var(--mist)' }}>Aucun jour assigné</p>
                  )}
                </div>
                <button
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-sm)] border transition-colors hover:bg-[var(--ocean-pale)] shrink-0"
                  style={{ borderColor: 'var(--ocean)', color: 'var(--ocean)' }}
                  onClick={() => handleOpenDaysModal(recipe)}
                >
                  <Calendar className="w-3 h-3" />
                  Jours
                </button>
                <button
                  className="w-7 h-7 rounded-md flex items-center justify-center border border-black/10 transition-colors hover:bg-[var(--coral-pale)] shrink-0"
                  style={{ color: 'var(--coral)' }}
                  aria-label="Retirer la recette"
                  onClick={() => onRemoveRecipe(recipe.recipeId)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add recipe dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={(o) => !o && setIsAddModalOpen(false)}>
        <DialogContent className="rounded-[var(--radius-md)] border-none sm:max-w-[600px] max-h-[90vh] overflow-y-auto" style={{ boxShadow: 'var(--shadow-card)' }}>
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold" style={{ color: 'var(--stone)' }}>
              Ajouter une recette
            </DialogTitle>
          </DialogHeader>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 py-2">
            <Select value={categoryFilter} onValueChange={(v: 'ALL' | RecipeCategory) => { setPage(1); setCategoryFilter(v); }}>
              <SelectTrigger className="w-[150px] rounded-[var(--radius-sm)] border-black/10 focus:ring-0 text-xs" style={{ background: 'var(--sand)' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Toutes catégories</SelectItem>
                {(Object.entries(CATEGORY_LABELS) as [RecipeCategory, string][]).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={minRating} onValueChange={(v) => { setPage(1); setMinRating(v); }}>
              <SelectTrigger className="w-[130px] rounded-[var(--radius-sm)] border-black/10 focus:ring-0 text-xs" style={{ background: 'var(--sand)' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Toutes notes</SelectItem>
                {[5, 4, 3, 2, 1].map((r) => (
                  <SelectItem key={r} value={String(r)}>{r} étoile{r > 1 ? 's' : ''} +</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(v) => { setPage(1); setSort(v); }}>
              <SelectTrigger className="w-[150px] rounded-[var(--radius-sm)] border-black/10 focus:ring-0 text-xs" style={{ background: 'var(--sand)' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NAME_ASC">Nom (A → Z)</SelectItem>
                <SelectItem value="NAME_DESC">Nom (Z → A)</SelectItem>
                <SelectItem value="RATING_DESC">Note élevée</SelectItem>
                <SelectItem value="RATING_ASC">Note faible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isPending ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--ocean)' }} />
            </div>
          ) : (
            <>
              <ul className="divide-y divide-black/5 list-none p-0 m-0">
                {recipes.map((recipe) => {
                  const isSelected = selectedRecipeIds.has(recipe.id);
                  const catStyle = CATEGORY_COLORS[recipe.category];
                  return (
                    <li key={recipe.id} className="flex items-center gap-3 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold m-0 truncate" style={{ color: 'var(--stone)' }}>
                          {recipe.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: catStyle.bg, color: catStyle.text }}
                          >
                            {CATEGORY_LABELS[recipe.category]}
                          </span>
                          <span className="text-[10px]" style={{ color: 'var(--sun)' }}>
                            {'★'.repeat(recipe.rating)}{'☆'.repeat(5 - recipe.rating)}
                          </span>
                        </div>
                      </div>
                      <button
                        disabled={isSelected}
                        className={cn(
                          'text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-sm)] border shrink-0 transition-all',
                          isSelected
                            ? 'opacity-50 cursor-not-allowed border-black/10'
                            : 'hover:bg-[var(--ocean-pale)] hover:-translate-y-px'
                        )}
                        style={
                          isSelected
                            ? { color: 'var(--mist)' }
                            : { borderColor: 'var(--ocean)', color: 'var(--ocean)' }
                        }
                        onClick={() => !isSelected && onAddRecipe(recipe.id, recipe.name)}
                      >
                        {isSelected ? 'Ajoutée' : 'Ajouter'}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-black/5">
                  <button
                    className="w-8 h-8 rounded-[var(--radius-sm)] border border-black/10 flex items-center justify-center disabled:opacity-40"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="w-4 h-4" style={{ color: 'var(--stone)' }} />
                  </button>
                  <span className="text-xs font-medium" style={{ color: 'var(--mist)' }}>
                    {page} / {totalPages}
                  </span>
                  <button
                    className="w-8 h-8 rounded-[var(--radius-sm)] border border-black/10 flex items-center justify-center disabled:opacity-40"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRight className="w-4 h-4" style={{ color: 'var(--stone)' }} />
                  </button>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end pt-2">
            <button
              className="text-sm font-semibold text-white px-5 py-2 rounded-[var(--radius-sm)] transition-all hover:-translate-y-px"
              style={{
                background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
                boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
              }}
              onClick={() => setIsAddModalOpen(false)}
            >
              Fermer
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign days dialog */}
      <Dialog open={!!selectedRecipeForDays} onOpenChange={(o) => { if (!o) { setSelectedRecipeForDays(null); setSelectedDays([]); } }}>
        <DialogContent className="rounded-[var(--radius-md)] border-none sm:max-w-[420px]" style={{ boxShadow: 'var(--shadow-card)' }}>
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold" style={{ color: 'var(--stone)' }}>
              Jours — {selectedRecipeForDays?.recipeName}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm" style={{ color: 'var(--mist)' }}>
            Sélectionne les jours où cette recette sera disponible (optionnel).
          </p>
          <div className="flex flex-wrap gap-2 py-2">
            {listDates.map((d) => {
              const active = selectedDays.includes(d.value);
              return (
                <button
                  key={d.value}
                  type="button"
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                  style={
                    active
                      ? { background: 'var(--ocean-pale)', borderColor: 'var(--ocean)', color: 'var(--ocean)' }
                      : { borderColor: 'rgba(0,0,0,0.1)', color: 'var(--mist)' }
                  }
                  onClick={() =>
                    setSelectedDays((prev) =>
                      prev.includes(d.value) ? prev.filter((x) => x !== d.value) : [...prev, d.value]
                    )
                  }
                >
                  {d.label}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              className="text-sm font-medium px-4 py-2 rounded-[var(--radius-sm)] border border-black/10 hover:bg-black/5"
              style={{ color: 'var(--stone)' }}
              onClick={() => { setSelectedRecipeForDays(null); setSelectedDays([]); }}
            >
              Annuler
            </button>
            <button
              className="text-sm font-semibold text-white px-5 py-2 rounded-[var(--radius-sm)] transition-all hover:-translate-y-px"
              style={{
                background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
                boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
              }}
              onClick={handleSaveDays}
            >
              Enregistrer
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
