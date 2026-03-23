import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import type { Recipe } from '../../../stores/recipes/recipes.types';

interface RecipeShareModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const RecipeShareModal = ({ recipe, onClose }: RecipeShareModalProps) => (
  <Dialog open={Boolean(recipe)} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="rounded-none border-gray-200">
      <DialogHeader>
        <DialogTitle className="text-xl font-light uppercase tracking-widest">Partager la recette</DialogTitle>
      </DialogHeader>
      <div className="pt-4 flex flex-col items-center gap-6">
        <div className="bg-gray-50 p-6 border border-gray-100 flex items-center justify-center">
          <Share2 className="w-12 h-12 text-black" />
        </div>
        <p className="text-gray-400 font-light text-sm text-center">
          Le partage de <span className="text-black font-normal">{recipe?.name}</span> sera bientôt disponible.
        </p>
        <Button
          className="rounded-none bg-black text-white w-full uppercase tracking-widest font-light text-xs"
          onClick={onClose}
        >
          Fermer
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);
