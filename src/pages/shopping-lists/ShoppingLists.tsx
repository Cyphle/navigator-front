import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  useFetchAllShoppingLists,
  useFetchShoppingListById,
  useCreateShoppingList,
  useDeleteShoppingList,
  useAddItemToShoppingList,
  useUpdateItemInShoppingList,
  useDeleteItemFromShoppingList,
  useClearCompletedItems,
} from '../../stores/shopping-lists/shopping-lists.queries';
import { useFetchFamilies } from '../../stores/families/families.queries';
import { ShoppingListsView } from './components/ShoppingListsView';
import { CreateShoppingListForm } from './components/CreateShoppingListForm';
import { ShoppingListDetail } from './components/ShoppingListDetail';
import type { CreateShoppingListInput, CreateShoppingListItemInput } from '../../stores/shopping-lists/shopping-lists.types';
import { Loader2 } from 'lucide-react';

export const ShoppingLists = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: lists, isPending, isError, error } = useFetchAllShoppingLists();
  const { data: families } = useFetchFamilies();
  const { data: selectedList } = useFetchShoppingListById(selectedListId || 0);
  const createMutation = useCreateShoppingList();
  const deleteMutation = useDeleteShoppingList();
  const addItemMutation = useAddItemToShoppingList();
  const updateItemMutation = useUpdateItemInShoppingList();
  const deleteItemMutation = useDeleteItemFromShoppingList();
  const clearCompletedMutation = useClearCompletedItems();

  const handleCreateList = (input: CreateShoppingListInput) => {
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

  const handleAddItem = (input: CreateShoppingListItemInput) => {
    if (!selectedListId) return;
    addItemMutation.mutate(
      { listId: selectedListId, input },
      {
        onSuccess: () => {
          toast({ title: 'Article ajouté' });
        },
        onError: () => {
          toast({ title: "Erreur lors de l'ajout de l'article", variant: 'destructive' });
        },
      }
    );
  };

  const handleToggleItem = (itemId: number, completed: boolean) => {
    if (!selectedListId) return;
    updateItemMutation.mutate(
      { listId: selectedListId, itemId, input: { completed } },
      {
        onSuccess: () => {
          toast({ title: completed ? 'Article marqué comme acheté' : 'Article marqué comme non acheté' });
        },
        onError: () => {
          toast({ title: "Erreur lors de la mise à jour de l'article", variant: 'destructive' });
        },
      }
    );
  };

  const handleDeleteItem = (itemId: number) => {
    if (!selectedListId) return;
    deleteItemMutation.mutate(
      { listId: selectedListId, itemId },
      {
        onSuccess: () => {
          toast({ title: 'Article supprimé' });
        },
        onError: () => {
          toast({ title: "Erreur lors de la suppression de l'article", variant: 'destructive' });
        },
      }
    );
  };

  const handleClearCompleted = () => {
    if (!selectedListId) return;
    clearCompletedMutation.mutate(selectedListId, {
      onSuccess: () => {
        toast({ title: 'Articles achetés supprimés' });
      },
      onError: () => {
        toast({ title: 'Erreur lors de la suppression', variant: 'destructive' });
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--ocean)' }} />
        <p className="text-xs uppercase tracking-widest font-medium mt-2" style={{ color: 'var(--mist)' }}>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm" style={{ color: 'var(--coral)' }}>{error.message}</p>
      </div>
    );
  }

  if (selectedListId && selectedList) {
    return (
      <ShoppingListDetail
        list={selectedList}
        onBack={() => setSelectedListId(null)}
        onAddItem={handleAddItem}
        onToggleItem={handleToggleItem}
        onDeleteItem={handleDeleteItem}
        onClearCompleted={handleClearCompleted}
      />
    );
  }

  return (
    <>
      <ShoppingListsView
        lists={lists || []}
        onCreateNew={() => setIsFormOpen(true)}
        onSelectList={setSelectedListId}
        onDelete={handleDeleteList}
      />

      <CreateShoppingListForm
        open={isFormOpen}
        onCancel={() => setIsFormOpen(false)}
        onSubmit={handleCreateList}
        isLoading={createMutation.isPending}
        families={families || []}
      />
    </>
  );
};
