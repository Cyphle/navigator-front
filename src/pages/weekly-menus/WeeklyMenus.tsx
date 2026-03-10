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
import { Button } from '@/components/ui/button';

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
      <div className="flex flex-col items-center justify-center py-24 gap-4 bg-gray-50 min-h-full">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-[10px] uppercase tracking-[0.2em] font-light text-gray-400">Chargement des menus...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 bg-gray-50 min-h-full">
        <div className="bg-red-50 p-8 border border-red-100 flex flex-col items-center gap-4">
          <p className="text-red-500 font-light text-sm">Une erreur est survenue lors du chargement des menus.</p>
          <Button variant="outline" className="rounded-none">Réessayer</Button>
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
    <div className="min-h-full bg-gray-50">
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
