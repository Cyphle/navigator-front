import './WeeklyMenus.scss';
import { useMemo, useState } from 'react';
import { Pagination, Select } from 'antd';
import { useFetchRecipesPage } from '../../stores/recipes/recipes.queries';
import type { Recipe, RecipeCategory } from '../../stores/recipes/recipes.types';
import { WeeklyMenusList } from './components/WeeklyMenusList';
import { WeeklyMenusSelected } from './components/WeeklyMenusSelected';

const CATEGORY_LABELS: Record<RecipeCategory, string> = {
  ENTREE: 'Entrée',
  PLAT: 'Plat',
  DESSERT: 'Dessert',
  SAUCE: 'Sauce',
  APERO: 'Apéro',
};

const DEFAULT_PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: 'NAME_ASC', label: 'Nom (A → Z)' },
  { value: 'NAME_DESC', label: 'Nom (Z → A)' },
  { value: 'RATING_DESC', label: 'Note élevée' },
  { value: 'RATING_ASC', label: 'Note faible' },
];

export const WeeklyMenus = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | RecipeCategory>('ALL');
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState('NAME_ASC');
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);

  const recipesQuery = useFetchRecipesPage(
    page,
    pageSize,
    categoryFilter === 'ALL' ? undefined : categoryFilter,
    undefined,
    minRating,
    sort
  );

  const { data, isPending, isError, error } = recipesQuery;
  const recipes = data?.items ?? [];
  const total = data?.total ?? 0;

  const selectedIds = useMemo(
    () => new Set(selectedRecipes.map((recipe) => recipe.id)),
    [selectedRecipes]
  );

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipes((prev) => (prev.some((item) => item.id === recipe.id) ? prev : [...prev, recipe]));
  };

  const handleRemoveRecipe = (recipeId: number) => {
    setSelectedRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="weekly-menus-page">
      <div className="weekly-menus-filters">
        <Select
          value={categoryFilter}
          onChange={(value) => {
            setPage(1);
            setCategoryFilter(value);
          }}
          options={[
            { value: 'ALL', label: 'Toutes les catégories' },
            { value: 'ENTREE', label: CATEGORY_LABELS.ENTREE },
            { value: 'PLAT', label: CATEGORY_LABELS.PLAT },
            { value: 'DESSERT', label: CATEGORY_LABELS.DESSERT },
            { value: 'SAUCE', label: CATEGORY_LABELS.SAUCE },
            { value: 'APERO', label: CATEGORY_LABELS.APERO },
          ]}
        />
        <Select
          value={minRating ?? 'ALL'}
          onChange={(value) => {
            setPage(1);
            setMinRating(value === 'ALL' ? undefined : Number(value));
          }}
          options={[
            { value: 'ALL', label: 'Toutes les notes' },
            { value: 5, label: '5 étoiles' },
            { value: 4, label: '4 étoiles +' },
            { value: 3, label: '3 étoiles +' },
            { value: 2, label: '2 étoiles +' },
            { value: 1, label: '1 étoile +' },
          ]}
        />
        <Select
          value={sort}
          onChange={(value) => {
            setPage(1);
            setSort(value);
          }}
          options={SORT_OPTIONS}
        />
      </div>

      <section className="weekly-menus-selected" data-testid="weekly-menus-selected">
        <WeeklyMenusSelected selectedRecipes={selectedRecipes} onRemove={handleRemoveRecipe} />
      </section>

      <section className="weekly-menus-list">
        <WeeklyMenusList
          recipes={recipes}
          categoryLabels={CATEGORY_LABELS}
          selectedIds={selectedIds}
          onSelect={handleSelectRecipe}
        />
      </section>

      <div className="weekly-menus-pagination">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          pageSizeOptions={['10', '50', '100']}
          onChange={(nextPage) => setPage(nextPage)}
          onShowSizeChange={(_currentPage, nextPageSize) => {
            setPage(1);
            setPageSize(nextPageSize);
          }}
        />
      </div>
    </div>
  );
};
