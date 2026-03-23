import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Search, Info } from 'lucide-react';
import type { Recipe, RecipeCategory } from '../../../stores/recipes/recipes.types';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  categoryLabels: Record<RecipeCategory, string>;
  onClose: () => void;
}

const isMultiPartRecipe = (recipe: Recipe): boolean =>
  Array.isArray(recipe.parts) && recipe.parts.length > 0;

const RecipeDetailContent = ({ recipe }: { recipe: Recipe }) => {
  return useMemo(() => {
    if (isMultiPartRecipe(recipe)) {
      return (
        <div className="recipe-detail__parts">
          {recipe.parts?.map((part, index) => (
            <div key={`${part.name}-${index}`} className="recipe-detail__part">
              <h3>{part.name}</h3>
              <div className="recipe-detail__columns">
                <div>
                  <h4>Ingrédients</h4>
                  <ul>
                    {part.ingredients.map((ingredient, i) => (
                      <li key={`${ingredient}-${i}`}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Préparation</h4>
                  <ol>
                    {part.steps.map((step, i) => (
                      <li key={`${step}-${i}`}>{step}</li>
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
            {recipe.ingredients?.map((ingredient, i) => (
              <li key={`${ingredient}-${i}`}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Préparation</h4>
          <ol>
            {recipe.steps?.map((step, i) => (
              <li key={`${step}-${i}`}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    );
  }, [recipe]);
};

export const RecipeDetailModal = ({ recipe, categoryLabels, onClose }: RecipeDetailModalProps) => (
  <Dialog open={Boolean(recipe)} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="max-w-3xl rounded-none border-gray-200 p-0 overflow-hidden">
      {recipe && (
        <div className="flex flex-col max-h-[90vh]">
          <div className="aspect-video relative bg-gray-50 flex items-center justify-center">
            {recipe.imageUrl ? (
              <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
            ) : (
              <Search className="w-12 h-12 text-gray-200" />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
              <span className="text-[10px] uppercase tracking-[0.2em] font-light text-blue-400 mb-2 block">
                {categoryLabels[recipe.category]}
              </span>
              <h2 className="text-3xl font-extralight text-white uppercase m-0 tracking-tight">{recipe.name}</h2>
            </div>
          </div>
          <div className="p-8 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-8">
                {recipe.ingredients?.length || recipe.parts?.length ? (
                  <div className="space-y-4">
                    <RecipeDetailContent recipe={recipe} />
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
                        {recipe.rating} / 5
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
);
