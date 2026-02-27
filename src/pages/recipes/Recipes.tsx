import './Recipes.scss';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Modal, Pagination, Select } from 'antd';
import { useFetchRecipesPage } from '../../stores/recipes/recipes.queries';
import type { Recipe, RecipeCategory } from '../../stores/recipes/recipes.types';
import { useDeleteRecipe, useUpdateRecipeRating } from '../../stores/recipes/recipes.commands';
import { RecipeList } from './components/RecipeList';
import { RecipeFormModal } from './components/RecipeFormModal';

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
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
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

  const handleSearchSubmit = (value: string) => {
    const trimmed = value.trim();

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    if (trimmed.length >= 3) {
      setPage(1);
      setSearchValue(trimmed);
      return;
    }

    if (trimmed.length === 0) {
      setPage(1);
      setSearchValue(undefined);
    }
  };

  const recipesQuery = useFetchRecipesPage(
    page,
    pageSize,
    categoryFilter === 'ALL' ? undefined : categoryFilter,
    searchValue
  );
  const { data, isPending, isError, error } = recipesQuery;

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
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="recipes-page">
      <div className="recipes-header">
        <div className="recipes-header__actions">
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Rechercher une recette"
            allowClear
            onPressEnter={(event) => handleSearchSubmit(event.currentTarget.value)}
          />
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
        </div>
        <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
          Ajouter une recette
        </Button>
      </div>

      <section className="recipes-list">
        <RecipeList
          recipes={recipes}
          categoryLabels={CATEGORY_LABELS}
          onSelect={setSelectedRecipe}
          onEdit={setEditRecipeTarget}
          onShare={setShareRecipeTarget}
          onDelete={setDeleteRecipeTarget}
          onRate={(id, rating) => updateRatingMutation({ id, rating })}
        />
      </section>

      <div className="recipes-pagination">
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

      <Modal
        open={Boolean(selectedRecipe)}
        onCancel={() => setSelectedRecipe(null)}
        footer={null}
        title={selectedRecipe?.name}
        className="recipe-detail-modal"
      >
        {selectedRecipe && (
          <div className="recipe-detail">
            <div className="recipe-detail__meta">
              <span className="recipe-detail__category">
                {CATEGORY_LABELS[selectedRecipe.category]}
              </span>
            </div>
            {detailContent}
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(deleteRecipeTarget)}
        onCancel={() => setDeleteRecipeTarget(null)}
        title="Supprimer la recette"
        className="recipe-delete-modal"
        okText="Confirmer"
        okButtonProps={{ danger: true, loading: deleteRecipePending }}
        cancelText="Annuler"
        onOk={() => {
          if (deleteRecipeTarget) {
            deleteRecipeMutation(deleteRecipeTarget.id);
          }
        }}
      >
        <p>Es-tu sûr de vouloir supprimer cette recette ?</p>
      </Modal>

      <RecipeFormModal
        open={Boolean(editRecipeTarget)}
        mode="edit"
        recipe={editRecipeTarget}
        onCancel={() => setEditRecipeTarget(null)}
      />

      <Modal
        open={Boolean(shareRecipeTarget)}
        onCancel={() => setShareRecipeTarget(null)}
        footer={null}
        title="Partager la recette"
      >
        <p>Le partage avec les familles sera disponible prochainement.</p>
      </Modal>

      <RecipeFormModal
        open={isCreateModalOpen}
        mode="create"
        onCancel={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};
