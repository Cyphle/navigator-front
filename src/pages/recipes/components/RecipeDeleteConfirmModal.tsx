import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Recipe } from '../../../stores/recipes/recipes.types';

interface RecipeDeleteConfirmModalProps {
  recipe: Recipe | null;
  isLoading: boolean;
  onConfirm: (recipe: Recipe) => void;
  onCancel: () => void;
}

export const RecipeDeleteConfirmModal = ({ recipe, isLoading, onConfirm, onCancel }: RecipeDeleteConfirmModalProps) => (
  <Dialog open={Boolean(recipe)} onOpenChange={(open) => !open && onCancel()}>
    <DialogContent className="rounded-none border-gray-200">
      <DialogHeader>
        <DialogTitle className="text-xl font-light uppercase tracking-widest text-red-500">
          Supprimer la recette
        </DialogTitle>
      </DialogHeader>
      <div className="pt-4 space-y-6">
        <p className="text-gray-400 font-light text-sm">
          Êtes-vous sûr de vouloir supprimer la recette{' '}
          <span className="text-black font-normal underline">{recipe?.name}</span> ? Cette action est irréversible.
        </p>
        <DialogFooter className="flex flex-row justify-end gap-2 pt-4 border-t border-gray-50">
          <Button
            variant="ghost"
            className="rounded-none uppercase tracking-widest font-light text-xs"
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            className="rounded-none uppercase tracking-widest font-light text-xs"
            disabled={isLoading}
            onClick={() => recipe && onConfirm(recipe)}
          >
            {isLoading ? 'Suppression...' : 'Confirmer'}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
);
