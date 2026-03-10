import { Button } from '@/components/ui/button';
import { Star, Edit2, Share2, Trash2 } from 'lucide-react';
import type { Recipe, RecipeCategory } from '../../../stores/recipes/recipes.types';
import { cn } from '@/lib/utils';

const HotDishIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-12 h-12 text-gray-200" data-testid="default-recipe-icon">
    <path fill="currentColor" d="M4 13.5a8 8 0 0 0 16 0V12H4v1.5Zm-1-3.5h18v2H3v-2Zm3.5-6.5c1.2 1.1 1.8 2.3 1.8 3.5h-1.5c0-.8-.3-1.6-1.2-2.4l.9-1.1Zm5 0c1.2 1.1 1.8 2.3 1.8 3.5h-1.5c0-.8-.3-1.6-1.2-2.4l.9-1.1Zm5 0c1.2 1.1 1.8 2.3 1.8 3.5h-1.5c0-.8-.3-1.6-1.2-2.4l.9-1.1Z" />
  </svg>
);

const Rate = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  return (
    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
      {[1, 2, 3, 4, 5].map((star) => (
        <label key={star} className="cursor-pointer">
          <input
            type="radio"
            value={star}
            checked={star === value}
            onChange={() => onChange(star)}
            className="sr-only"
          />
          <Star
            className={cn(
              "w-4 h-4 transition-colors",
              star <= value ? "fill-blue-500 text-blue-500" : "text-gray-200"
            )}
            aria-hidden
          />
        </label>
      ))}
    </div>
  );
};

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {recipes.map((recipe) => (
        <article
          key={recipe.id}
          className="group bg-white border border-gray-100 flex flex-col cursor-pointer transition-all hover:border-gray-200"
          onClick={() => onSelect(recipe)}
        >
          <div className="aspect-video bg-gray-50 flex items-center justify-center overflow-hidden">
            {recipe.imageUrl ? (
              <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <HotDishIcon />
            )}
          </div>
          <div className="p-6 flex flex-col flex-1 gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-extralight text-black uppercase m-0 line-clamp-1">{recipe.name}</h2>
              <span className="text-[10px] uppercase tracking-widest font-light text-gray-400">{categoryLabels[recipe.category]}</span>
              <div
                className="mt-3"
                data-testid={`recipe-rating-${recipe.id}`}
              >
                <Rate
                  value={recipe.rating}
                  onChange={(value) => onRate(recipe.id, value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                aria-label="Modifier"
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-gray-400 hover:text-black hover:bg-gray-50"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(recipe);
                }}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                aria-label="Partager"
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-gray-400 hover:text-black hover:bg-gray-50"
                onClick={(event) => {
                  event.stopPropagation();
                  onShare(recipe);
                }}
              >
                <Share2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                aria-label="Supprimer"
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-red-300 hover:text-red-500 hover:bg-red-50"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(recipe);
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
