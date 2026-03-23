import { useState } from 'react';
import { useFetchRecipesPage } from '../../stores/recipes/recipes.queries';
import type { Recipe, RecipeCategory } from '../../stores/recipes/recipes.types';
import { useDeleteRecipe, useUpdateRecipeRating } from '../../stores/recipes/recipes.commands';
import { RecipeList } from './components/RecipeList';
import { RecipeFormModal } from './components/RecipeFormModal';
import { RecipePageHeader } from './components/RecipePageHeader';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { RecipeShareModal } from './components/RecipeShareModal';
import { RecipeDeleteConfirmModal } from './components/RecipeDeleteConfirmModal';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_LABELS: Record<RecipeCategory, string> = {
  ENTREE: 'Entrée',
  PLAT: 'Plat',
  DESSERT: 'Dessert',
  SAUCE: 'Sauce',
  APERO: 'Apéro',
};

const DEFAULT_PAGE_SIZE = 10;

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

  const recipesQuery = useFetchRecipesPage(
    page,
    pageSize,
    categoryFilter === 'ALL' ? undefined : categoryFilter,
    searchValue
  );
  const { data, isPending, isError } = recipesQuery;

  const { mutate: deleteRecipeMutation, isPending: deleteRecipePending } =
    useDeleteRecipe(() => setDeleteRecipeTarget(null), () => setDeleteRecipeTarget(null));

  const { mutate: updateRatingMutation } =
    useUpdateRecipeRating(() => undefined, () => undefined);

  const total = data?.total ?? 0;
  const recipes = data?.items ?? [];
  const totalPages = Math.ceil(total / pageSize);

  const handleCategoryChange = (value: 'ALL' | RecipeCategory) => {
    setPage(1);
    setCategoryFilter(value);
  };

  const handleSearchCommit = (value: string) => {
    setPage(1);
    setSearchValue(value.length >= 3 ? value : undefined);
  };

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
      <RecipePageHeader
        searchInput={searchInput}
        categoryFilter={categoryFilter}
        categoryLabels={CATEGORY_LABELS}
        onSearchChange={setSearchInput}
        onSearchCommit={handleSearchCommit}
        onCategoryChange={handleCategoryChange}
        onCreate={() => setIsCreateModalOpen(true)}
      />

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
                    className={cn('rounded-none cursor-pointer', page === 1 && 'pointer-events-none opacity-50')}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      className={cn('rounded-none cursor-pointer', page === i + 1 && 'bg-black text-white hover:bg-black hover:text-white')}
                      onClick={() => setPage(i + 1)}
                      isActive={page === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    className={cn('rounded-none cursor-pointer', page === totalPages && 'pointer-events-none opacity-50')}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <RecipeDetailModal
        recipe={selectedRecipe}
        categoryLabels={CATEGORY_LABELS}
        onClose={() => setSelectedRecipe(null)}
      />
      <RecipeShareModal
        recipe={shareRecipeTarget}
        onClose={() => setShareRecipeTarget(null)}
      />
      <RecipeDeleteConfirmModal
        recipe={deleteRecipeTarget}
        isLoading={deleteRecipePending}
        onConfirm={(recipe) => deleteRecipeMutation(recipe.id)}
        onCancel={() => setDeleteRecipeTarget(null)}
      />
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
