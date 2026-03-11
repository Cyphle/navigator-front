import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
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
import { Loader2 } from 'lucide-react';

export const WeeklyMenus = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: lists, isPending, isError } = useFetchAllPlannedMenuLists();
  const { data: selectedList } = useFetchPlannedMenuListById(selectedListId || 0);
  const createMutation = useCreatePlannedMenuList();
  const updateMutation = useUpdatePlannedMenuList();
  const deleteMutation = useDeletePlannedMenuList();
  const addRecipeMutation = useAddRecipeToPlannedMenuList();
  const removeRecipeMutation = useRemoveRecipeFromPlannedMenuList();

  const handleCreateList = (input: CreatePlannedMenuListInput) => {
    createMutation.mutate(input, {
      onSuccess: () => {
        toast({ title: 'Liste créée avec succès' });
        setIsFormOpen(false);
      },
      onError: () => {
        toast({ title: 'Erreur lors de la création de la liste', variant: 'destructive' });
      },
    });
  };

  const handleDeleteList = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: 'Liste supprimée' });
      },
      onError: () => {
        toast({ title: 'Erreur lors de la suppression', variant: 'destructive' });
      },
    });
  };

  const handleToggleShoppingList = (id: number, isActive: boolean) => {
    updateMutation.mutate(
      { id, input: { isActiveShoppingList: isActive } },
      {
        onSuccess: () => {
          toast({ title: isActive ? 'Liste de courses activée' : 'Liste de courses désactivée' });
        },
        onError: () => {
          toast({ title: 'Erreur lors de la mise à jour', variant: 'destructive' });
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
          toast({ title: 'Recette ajoutée' });
        },
        onError: () => {
          toast({ title: "Erreur lors de l'ajout de la recette", variant: 'destructive' });
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
          toast({ title: 'Recette retirée' });
        },
        onError: () => {
          toast({ title: 'Erreur lors du retrait de la recette', variant: 'destructive' });
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
          toast({ title: 'Jours mis à jour' });
        },
        onError: () => {
          toast({ title: 'Erreur lors de la mise à jour', variant: 'destructive' });
        },
      }
    );
  };

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 min-h-full" style={{ background: 'var(--sand)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--ocean)' }} />
        <p className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--mist)' }}>
          Loading...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-12 min-h-full" style={{ background: 'var(--sand)' }}>
        <div
          className="rounded-[var(--radius-lg)] p-8 flex flex-col items-center gap-4"
          style={{ background: 'var(--coral-pale)', color: 'var(--coral)' }}
        >
          <p className="text-sm font-medium">Une erreur est survenue (error loading menus).</p>
        </div>
      </div>
    );
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
    <div className="min-h-full" style={{ background: 'var(--sand)' }}>
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
    </div>
  );
};
