import { Button, Rate } from 'antd';
import type { Recipe, RecipeCategory } from '../../../stores/recipes/recipes.types';

interface WeeklyMenusListProps {
  recipes: Recipe[];
  categoryLabels: Record<RecipeCategory, string>;
  selectedIds: Set<number>;
  onSelect: (recipe: Recipe) => void;
}

export const WeeklyMenusList = ({
  recipes,
  categoryLabels,
  selectedIds,
  onSelect,
}: WeeklyMenusListProps) => {
  return (
    <div className="weekly-menus-list__grid">
      {recipes.map((recipe) => (
        <article key={recipe.id} className="weekly-menus-card">
          <div>
            <h2>{recipe.name}</h2>
            <span className="weekly-menus-card__category">{categoryLabels[recipe.category]}</span>
          </div>
          <Rate value={recipe.rating} allowClear={false} disabled />
          <Button
            type="primary"
            onClick={() => onSelect(recipe)}
            disabled={selectedIds.has(recipe.id)}
          >
            {selectedIds.has(recipe.id) ? 'Ajoutée' : 'Ajouter'}
          </Button>
        </article>
      ))}
    </div>
  );
};
