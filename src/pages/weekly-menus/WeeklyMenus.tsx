import './WeeklyMenus.scss';
import { useState } from 'react';
import { message } from 'antd';
import {
  useFetchAllPlannedMenuLists,
  useFetchPlannedMenuListById,
  useCreatePlannedMenuList,
  useUpdatePlannedMenuList,
  useDeletePlannedMenuList,
  useAddRecipeToPlannedMenuList,
  useRemoveRecipeFromPlannedMenuList,
} from '../../stores/planned-menus/planned-menus.queries';
import { PlannedMenuListsView } from './components/PlannedMenuListsView';
import { PlannedMenuListForm } from './components/PlannedMenuListForm';
import { PlannedMenuListDetail } from './components/PlannedMenuListDetail';
import type { CreatePlannedMenuListInput } from '../../stores/planned-menus/planned-menus.types';

export const WeeklyMenus = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

  const { data: lists, isPending, isError, error } = useFetchAllPlannedMenuLists();
  const { data: selectedList } = useFetchPlannedMenuListById(selectedListId || 0);
  const createMutation = useCreatePlannedMenuList();
  const updateMutation = useUpdatePlannedMenuList();
  const deleteMutation = useDeletePlannedMenuList();
  const addRecipeMutation = useAddRecipeToPlannedMenuList();
  const removeRecipeMutation = useRemoveRecipeFromPlannedMenuList();

  const handleCreateList = (input: CreatePlannedMenuListInput) => {
    createMutation.mutate(input, {
      onSuccess: () => {
        message.success('Liste créée avec succès');
        setIsFormOpen(false);
      },
      onError: () => {
        message.error('Erreur lors de la création de la liste');
      },
    });
  };

  const handleDeleteList = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        message.success('Liste supprimée');
      },
      onError: () => {
        message.error('Erreur lors de la suppression');
      },
    });
  };

  const handleToggleShoppingList = (id: number, isActive: boolean) => {
    updateMutation.mutate(
      { id, input: { isActiveShoppingList: isActive } },
      {
        onSuccess: () => {
          message.success(isActive ? 'Liste de courses activée' : 'Liste de courses désactivée');
        },
        onError: () => {
          message.error('Erreur lors de la mise à jour');
        },
      }
    );
  };

  const handleAddRecipe = (recipeId: number, recipeName: string, assignedDays?: string[]) => {
    if (!selectedListId) return;

    addRecipeMutation.mutate(
      { listId: selectedListId, recipeId, recipeName, assignedDays },
      {
        onSuccess: () => {
          message.success('Recette ajoutée');
        },
        onError: () => {
          message.error("Erreur lors de l'ajout de la recette");
        },
      }
    );
  };

  const handleRemoveRecipe = (recipeId: number) => {
    if (!selectedListId) return;

    removeRecipeMutation.mutate(
      { listId: selectedListId, recipeId },
      {
        onSuccess: () => {
          message.success('Recette retirée');
        },
        onError: () => {
          message.error('Erreur lors du retrait de la recette');
        },
      }
    );
  };

  const handleUpdateRecipeDays = (recipeId: number, recipeName: string, assignedDays?: string[]) => {
    if (!selectedListId) return;

    addRecipeMutation.mutate(
      { listId: selectedListId, recipeId, recipeName, assignedDays },
      {
        onSuccess: () => {
          message.success('Jours mis à jour');
        },
        onError: () => {
          message.error('Erreur lors de la mise à jour');
        },
      }
    );
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  // Show detail view if a list is selected
  if (selectedListId && selectedList) {
    return (
      <PlannedMenuListDetail
        list={selectedList}
        onBack={() => setSelectedListId(null)}
        onAddRecipe={handleAddRecipe}
        onRemoveRecipe={handleRemoveRecipe}
        onUpdateRecipeDays={handleUpdateRecipeDays}
      />
    );
  }

  // Show list view
  return (
    <>
      <PlannedMenuListsView
        lists={lists || []}
        onCreateNew={() => setIsFormOpen(true)}
        onSelectList={setSelectedListId}
        onDelete={handleDeleteList}
        onToggleShoppingList={handleToggleShoppingList}
      />

      <PlannedMenuListForm
        open={isFormOpen}
        onCancel={() => setIsFormOpen(false)}
        onSubmit={handleCreateList}
        isLoading={createMutation.isPending}
      />
    </>
  );
};
