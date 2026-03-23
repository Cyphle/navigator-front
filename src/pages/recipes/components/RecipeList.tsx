import { Edit2, Share2, Trash2, UtensilsCrossed, Plus } from 'lucide-react';
import type { Recipe, RecipeCategory } from '../../../stores/recipes/recipes.types';
import { cn } from '@/lib/utils';

/** Gradient backgrounds per recipe category */
const CATEGORY_GRADIENTS: Record<RecipeCategory, string> = {
  PLAT:    'linear-gradient(135deg, var(--sage-pale) 0%, var(--ocean-pale) 100%)',
  DESSERT: 'linear-gradient(135deg, var(--coral-pale) 0%, #FBBFBF 100%)',
  ENTREE:  'linear-gradient(135deg, var(--sun-pale) 0%, #FDE8B4 100%)',
  APERO:   'linear-gradient(135deg, var(--ocean-pale) 0%, var(--sage-pale) 100%)',
  SAUCE:   'linear-gradient(135deg, var(--sage-pale) 0%, var(--ocean-pale) 100%)',
};

const HotDishIcon = () => (
  <svg data-testid="default-recipe-icon" viewBox="0 0 24 24" aria-hidden="true" className="w-10 h-10" style={{ color: 'var(--mist)' }}>
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
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className={cn(
              "w-4 h-4 transition-colors",
              star <= value ? "fill-current" : "fill-transparent stroke-current"
            )}
            style={{ color: 'var(--sun)', strokeWidth: star <= value ? 0 : 1.5 }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 0 0 .95.69h4.168c.969 0 1.371 1.24.588 1.81l-3.374 2.453a1 1 0 0 0-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.374-2.452a1 1 0 0 0-1.175 0l-3.374 2.452c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 0 0-.364-1.118L2.057 9.393c-.783-.57-.38-1.81.588-1.81h4.168a1 1 0 0 0 .95-.69l1.286-3.966Z" />
          </svg>
        </label>
      ))}
    </div>
  );
};

interface RecipeListProps {
  recipes: Recipe[];
  categoryLabels: Record<RecipeCategory, string>;
  isFiltered: boolean;
  onSelect: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onShare: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  onRate: (id: number, rating: number) => void;
  onCreateNew: () => void;
}

export const RecipeList = ({
  recipes,
  categoryLabels,
  isFiltered,
  onSelect,
  onEdit,
  onShare,
  onDelete,
  onRate,
  onCreateNew,
}: RecipeListProps) => {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div
          className="w-16 h-16 rounded-[var(--radius-lg)] flex items-center justify-center"
          style={{ background: 'var(--sun-pale)', color: 'var(--sun)' }}
        >
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold m-0" style={{ color: 'var(--stone)' }}>
            {isFiltered ? 'Aucune recette trouvée' : 'Aucune recette pour le moment'}
          </p>
          <p className="text-sm mt-1 m-0" style={{ color: 'var(--mist)' }}>
            {isFiltered
              ? 'Essayez de modifier vos filtres ou votre recherche.'
              : 'Ajoutez votre première recette pour constituer votre carnet.'}
          </p>
        </div>
        {!isFiltered && (
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-[var(--radius-sm)] transition-all duration-150 hover:-translate-y-px"
            style={{
              background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
              boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
            }}
          >
            <Plus className="w-4 h-4" />
            Ajouter une recette
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
      {recipes.map((recipe) => (
        <article
          key={recipe.id}
          className="bg-white rounded-[var(--radius-lg)] overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1"
          style={{ boxShadow: 'var(--shadow-soft)' }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-soft)')}
          onClick={() => onSelect(recipe)}
        >
          {/* Image / gradient placeholder */}
          <div
            className="h-28 flex items-center justify-center relative overflow-hidden"
            style={{ background: CATEGORY_GRADIENTS[recipe.category] }}
          >
            {recipe.imageUrl ? (
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <HotDishIcon />
            )}
            {/* Category badge */}
            <span
              className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-white"
              style={{ color: 'var(--ocean)' }}
            >
              {categoryLabels[recipe.category]}
            </span>
          </div>

          {/* Body */}
          <div className="p-4">
            <h3
              className="font-display text-base font-semibold mb-1.5 m-0 line-clamp-1"
              style={{ color: 'var(--stone)' }}
            >
              {recipe.name}
            </h3>

            {/* Star rating */}
            <div className="mb-3" data-testid={`recipe-rating-${recipe.id}`}>
              <Rate value={recipe.rating} onChange={(v) => onRate(recipe.id, v)} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-black/5">
              <button
                aria-label="Modifier"
                className="flex items-center gap-1.5 border text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--ocean-pale)]"
                style={{ borderColor: 'rgba(0,0,0,0.1)', color: 'var(--stone)', background: 'transparent' }}
                onClick={(e) => { e.stopPropagation(); onEdit(recipe); }}
              >
                <Edit2 className="w-3 h-3" />
                Modifier
              </button>
              <button
                aria-label="Partager"
                className="flex items-center gap-1.5 border text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--ocean-pale)]"
                style={{ borderColor: 'rgba(0,0,0,0.1)', color: 'var(--stone)', background: 'transparent' }}
                onClick={(e) => { e.stopPropagation(); onShare(recipe); }}
              >
                <Share2 className="w-3 h-3" />
                Partager
              </button>
              <button
                aria-label="Supprimer"
                className="ml-auto flex items-center gap-1 border text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors hover:bg-[var(--coral-pale)]"
                style={{ borderColor: 'var(--coral)', color: 'var(--coral)', background: 'transparent' }}
                onClick={(e) => { e.stopPropagation(); onDelete(recipe); }}
              >
                <Trash2 className="w-3 h-3" />
                Supprimer
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
