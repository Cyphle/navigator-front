import { Modal } from 'antd';
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
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title={title}
    >
      <p>{description}</p>
    </Modal>
  );
};
