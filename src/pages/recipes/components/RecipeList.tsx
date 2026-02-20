import { Button, Rate } from 'antd';
import type { Recipe, RecipeCategory } from '../../../stores/recipes/recipes.types';

const HotDishIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="recipe-card__icon" data-testid="default-recipe-icon">
    <path d="M4 13.5a8 8 0 0 0 16 0V12H4v1.5Zm-1-3.5h18v2H3v-2Zm3.5-6.5c1.2 1.1 1.8 2.3 1.8 3.5h-1.5c0-.8-.3-1.6-1.2-2.4l.9-1.1Zm5 0c1.2 1.1 1.8 2.3 1.8 3.5h-1.5c0-.8-.3-1.6-1.2-2.4l.9-1.1Zm5 0c1.2 1.1 1.8 2.3 1.8 3.5h-1.5c0-.8-.3-1.6-1.2-2.4l.9-1.1Z" />
  </svg>
);

interface RecipeListProps {
  recipes: Recipe[];
  categoryLabels: Record<RecipeCategory, string>;
  onSelect: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onShare: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  onRate: (id: number, rating: number) => void;
}

export const RecipeList = ({
  recipes,
  categoryLabels,
  onSelect,
  onEdit,
  onShare,
  onDelete,
  onRate,
}: RecipeListProps) => {
  return (
    <>
      {recipes.map((recipe) => (
        <article
          key={recipe.id}
          className="recipe-card"
          onClick={() => onSelect(recipe)}
        >
          <div className="recipe-card__media">
            {recipe.imageUrl ? (
              <img src={recipe.imageUrl} alt={recipe.name} className="recipe-card__image" />
            ) : (
              <HotDishIcon />
            )}
          </div>
          <div className="recipe-card__content">
            <div>
              <h2>{recipe.name}</h2>
              <span className="recipe-card__category">{categoryLabels[recipe.category]}</span>
              <div
                className="recipe-card__rating"
                data-testid={`recipe-rating-${recipe.id}`}
                onClick={(event) => event.stopPropagation()}
              >
                <Rate
                  value={recipe.rating}
                  onChange={(value) => onRate(recipe.id, value)}
                  allowClear={false}
                />
              </div>
            </div>
            <div className="recipe-card__actions">
              <Button
                type="text"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(recipe);
                }}
              >
                Modifier
              </Button>
              <Button
                type="text"
                onClick={(event) => {
                  event.stopPropagation();
                  onShare(recipe);
                }}
              >
                Partager
              </Button>
              <Button
                danger
                type="text"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(recipe);
                }}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </article>
      ))}
    </>
  );
};
