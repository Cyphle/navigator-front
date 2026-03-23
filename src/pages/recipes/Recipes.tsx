import { useEffect, useMemo, useRef, useState } from 'react';
import { useFetchRecipesPage } from '../../stores/recipes/recipes.queries';
import type { Recipe, RecipeCategory } from '../../stores/recipes/recipes.types';
import { useDeleteRecipe, useUpdateRecipeRating } from '../../stores/recipes/recipes.commands';
import { RecipeList } from './components/RecipeList';
import { RecipeFormModal } from './components/RecipeFormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Plus, Loader2, Share2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_LABELS: Record<RecipeCategory, string> = {
  ENTREE: 'Entrée',
  PLAT: 'Plat',
  DESSERT: 'Dessert',
  SAUCE: 'Sauce',
  APERO: 'Apéro',
};

const DEFAULT_PAGE_SIZE = 10;

const isMultiPartRecipe = (recipe: Recipe): boolean => Array.isArray(recipe.parts) && recipe.parts.length > 0;

export const Recipes = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | RecipeCategory>('ALL');
  const [searchInput, setSearchInput] = useState('');
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [deleteRecipeTarget, setDeleteRecipeTarget] = useState<Recipe | null>(null);
  const [shareRecipeTarget, setShareRecipeTarget] = useState<Recipe | null>(null);
  const [editRecipeTarget, setEditRecipeTarget] = useState<Recipe | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const debounceRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const trimmed = searchInput.trim();

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      if (trimmed.length >= 3) {
        setPage(1);
        setSearchValue(trimmed);
        return;
      }

      if (trimmed.length === 0) {
        setPage(1);
        setSearchValue(undefined);
      }
    }, 2000);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [searchInput]);

  const recipesQuery = useFetchRecipesPage(
    page,
    pageSize,
    categoryFilter === 'ALL' ? undefined : categoryFilter,
    searchValue
  );
  const { data, isPending, isError } = recipesQuery;

  const onDeleteSuccess = () => {
    setDeleteRecipeTarget(null);
  };

  const onDeleteError = () => {
    setDeleteRecipeTarget(null);
  };

  const {
    mutate: deleteRecipeMutation,
    isPending: deleteRecipePending,
  } = useDeleteRecipe(onDeleteError, onDeleteSuccess);

  const {
    mutate: updateRatingMutation,
  } = useUpdateRecipeRating(() => undefined, () => undefined);

  const total = data?.total ?? 0;
  const recipes = data?.items ?? [];

  const detailContent = useMemo(() => {
    if (!selectedRecipe) {
      return null;
    }

    if (isMultiPartRecipe(selectedRecipe)) {
      return (
        <div className="recipe-detail__parts">
          {selectedRecipe.parts?.map((part, index) => (
            <div key={`${part.name}-${index}`} className="recipe-detail__part">
              <h3>{part.name}</h3>
              <div className="recipe-detail__columns">
                <div>
                  <h4>Ingrédients</h4>
                  <ul>
                    {part.ingredients.map((ingredient, ingredientIndex) => (
                      <li key={`${ingredient}-${ingredientIndex}`}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Préparation</h4>
                  <ol>
                    {part.steps.map((step, stepIndex) => (
                      <li key={`${step}-${stepIndex}`}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="recipe-detail__columns">
        <div>
          <h4>Ingrédients</h4>
          <ul>
            {selectedRecipe.ingredients?.map((ingredient, index) => (
              <li key={`${ingredient}-${index}`}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Préparation</h4>
          <ol>
            {selectedRecipe.steps?.map((step, index) => (
              <li key={`${step}-${index}`}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    );
  }, [selectedRecipe]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-16 md:py-24 gap-4 bg-gray-50 min-h-full">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-[10px] uppercase tracking-[0.2em] font-light text-gray-400">Chargement des recettes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 bg-gray-50 min-h-full">
        <div className="bg-red-50 p-8 border border-red-100 flex flex-col items-center gap-4">
          <p className="text-red-500 font-light text-sm">Une erreur est survenue lors du chargement des recettes.</p>
          <Button variant="outline" className="rounded-none" onClick={() => recipesQuery.refetch()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-full">
      <header className="flex flex-col sm:flex-row gap-3 md:gap-6 mb-6 md:mb-8 justify-between">
        <div className="flex flex-1 gap-3 md:gap-4 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="rounded-none border-gray-200 pl-10 focus:border-blue-500 focus-visible:ring-0 transition-colors"
              placeholder="Rechercher une recette"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const trimmed = searchInput.trim();
                  if (debounceRef.current) {
                    window.clearTimeout(debounceRef.current);
                  }
                  setPage(1);
                  setSearchValue(trimmed.length >= 3 ? trimmed : undefined);
                }
              }}
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={(value: 'ALL' | RecipeCategory) => {
              setPage(1);
              setCategoryFilter(value);
            }}
          >
            <SelectTrigger className="w-[140px] md:w-[180px] rounded-none border-gray-200 focus:ring-0 transition-colors bg-white">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectItem value="ALL">Toutes les catégories</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-none bg-black hover:bg-gray-800 text-white uppercase tracking-widest font-light text-xs"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une recette
        </Button>
      </header>

      <div className="space-y-8">
        <RecipeList
          recipes={recipes}
          categoryLabels={CATEGORY_LABELS}
          isFiltered={categoryFilter !== 'ALL' || Boolean(searchValue)}
          onSelect={setSelectedRecipe}
          onEdit={setEditRecipeTarget}
          onShare={setShareRecipeTarget}
          onDelete={setDeleteRecipeTarget}
          onRate={(id, rating) => updateRatingMutation({ id, rating })}
          onCreateNew={() => setIsCreateModalOpen(true)}
        />

        {total > pageSize && (
          <div className="flex justify-center pt-8 border-t border-gray-100">
            <Pagination>
              <PaginationContent className="rounded-none">
                <PaginationItem>
                  <PaginationPrevious 
                    className={cn("rounded-none cursor-pointer", page === 1 && "pointer-events-none opacity-50")}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  />
                </PaginationItem>
                {Array.from({ length: Math.ceil(total / pageSize) }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      className={cn("rounded-none cursor-pointer", page === i + 1 && "bg-black text-white hover:bg-black hover:text-white")}
                      onClick={() => setPage(i + 1)}
                      isActive={page === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    className={cn("rounded-none cursor-pointer", page === Math.ceil(total / pageSize) && "pointer-events-none opacity-50")}
                    onClick={() => setPage(p => Math.min(Math.ceil(total / pageSize), p + 1))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Recipe Detail View Modal */}
      <Dialog open={Boolean(selectedRecipe)} onOpenChange={(open) => !open && setSelectedRecipe(null)}>
        <DialogContent className="max-w-3xl rounded-none border-gray-200 p-0 overflow-hidden">
          {selectedRecipe && (
            <div className="flex flex-col max-h-[90vh]">
              <div className="aspect-video relative bg-gray-50 flex items-center justify-center">
                {selectedRecipe.imageUrl ? (
                  <img src={selectedRecipe.imageUrl} alt={selectedRecipe.name} className="w-full h-full object-cover" />
                ) : (
                  <Search className="w-12 h-12 text-gray-200" />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-light text-blue-400 mb-2 block">
                    {CATEGORY_LABELS[selectedRecipe.category]}
                  </span>
                  <h2 className="text-3xl font-extralight text-white uppercase m-0 tracking-tight">{selectedRecipe.name}</h2>
                </div>
              </div>
              <div className="p-8 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="md:col-span-2 space-y-8">
                    {detailContent ? (
                      <div className="space-y-4">
                        {detailContent}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-300 gap-2">
                        <Info className="w-8 h-8" />
                        <p className="text-xs font-light uppercase tracking-widest">Aucun détail disponible</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-8 border-l border-gray-100 pl-8 hidden md:block">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-light text-gray-400 mb-4">Informations</h4>
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[8px] uppercase tracking-tighter text-gray-300">Note</span>
                          <div className="flex gap-0.5 text-blue-500">
                             {selectedRecipe.rating} / 5
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog open={Boolean(shareRecipeTarget)} onOpenChange={(open) => !open && setShareRecipeTarget(null)}>
        <DialogContent className="rounded-none border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-light uppercase tracking-widest">Partager la recette</DialogTitle>
          </DialogHeader>
          <div className="pt-4 flex flex-col items-center gap-6">
            <div className="bg-gray-50 p-6 border border-gray-100 flex items-center justify-center">
              <Share2 className="w-12 h-12 text-black" />
            </div>
            <p className="text-gray-400 font-light text-sm text-center">
              Le partage de <span className="text-black font-normal">{shareRecipeTarget?.name}</span> sera bientôt disponible.
            </p>
            <Button className="rounded-none bg-black text-white w-full uppercase tracking-widest font-light text-xs" onClick={() => setShareRecipeTarget(null)}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={Boolean(deleteRecipeTarget)} onOpenChange={(open) => !open && setDeleteRecipeTarget(null)}>
        <DialogContent className="rounded-none border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-light uppercase tracking-widest text-red-500">Supprimer la recette</DialogTitle>
          </DialogHeader>
          <div className="pt-4 space-y-6">
            <p className="text-gray-400 font-light text-sm">
              Êtes-vous sûr de vouloir supprimer la recette <span className="text-black font-normal underline">{deleteRecipeTarget?.name}</span> ? Cette action est irréversible.
            </p>
            <DialogFooter className="flex flex-row justify-end gap-2 pt-4 border-t border-gray-50">
              <Button variant="ghost" className="rounded-none uppercase tracking-widest font-light text-xs" onClick={() => setDeleteRecipeTarget(null)}>
                Annuler
              </Button>
              <Button
                variant="destructive"
                className="rounded-none uppercase tracking-widest font-light text-xs"
                disabled={deleteRecipePending}
                onClick={() => deleteRecipeTarget && deleteRecipeMutation(deleteRecipeTarget.id)}
              >
                {deleteRecipePending ? "Suppression..." : "Confirmer"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <RecipeFormModal
        open={isCreateModalOpen}
        mode="create"
        onCancel={() => setIsCreateModalOpen(false)}
      />

      <RecipeFormModal
        open={Boolean(editRecipeTarget)}
        mode="edit"
        recipe={editRecipeTarget}
        onCancel={() => setEditRecipeTarget(null)}
      />
    </div>
  );
};
