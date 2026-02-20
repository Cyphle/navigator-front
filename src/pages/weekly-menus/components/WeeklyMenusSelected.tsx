import { Button } from 'antd';
import type { Recipe } from '../../../stores/recipes/recipes.types';

interface WeeklyMenusSelectedProps {
  selectedRecipes: Recipe[];
  onRemove: (recipeId: number) => void;
}

export const WeeklyMenusSelected = ({ selectedRecipes, onRemove }: WeeklyMenusSelectedProps) => {
  return (
    <div className="weekly-menus-selected__content">
      <div className="weekly-menus-selected__header">
        <h2>Recettes sélectionnées</h2>
        <span>{selectedRecipes.length} sélectionnée(s)</span>
      </div>

      {selectedRecipes.length === 0 ? (
        <p className="weekly-menus-empty">Aucune recette sélectionnée.</p>
      ) : (
        <ul className="weekly-menus-selected__list">
          {selectedRecipes.map((recipe) => (
            <li key={recipe.id} className="weekly-menus-selected__item">
              <span>{recipe.name}</span>
              <Button type="text" onClick={() => onRemove(recipe.id)}>
                Retirer
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
