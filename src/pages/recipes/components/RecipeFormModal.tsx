import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Recipe } from '../../../stores/recipes/recipes.types';

interface RecipeFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  recipe?: Recipe | null;
  onCancel: () => void;
}

export const RecipeFormModal = ({ open, mode, recipe, onCancel }: RecipeFormModalProps) => {
  const title = mode === 'create' ? 'Créer une recette' : 'Mettre à jour la recette';
  const description = mode === 'create'
    ? 'Le formulaire de création sera disponible prochainement.'
    : `La mise à jour de ${recipe?.name ?? 'cette recette'} sera disponible prochainement.`;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="rounded-none border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-light uppercase tracking-widest">{title}</DialogTitle>
        </DialogHeader>
        <p className="text-gray-400 font-light text-sm pt-4 italic">{description}</p>
      </DialogContent>
    </Dialog>
  );
};
