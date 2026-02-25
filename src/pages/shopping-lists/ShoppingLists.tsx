import './ShoppingLists.scss';
import { useState } from 'react';
import { message } from 'antd';
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

export const ShoppingLists = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

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

  const handleAddItem = (input: CreateShoppingListItemInput) => {
    if (!selectedListId) return;

    addItemMutation.mutate(
      { listId: selectedListId, input },
      {
        onSuccess: () => {
          message.success('Article ajouté');
        },
        onError: () => {
          message.error("Erreur lors de l'ajout de l'article");
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
          message.success(completed ? 'Article marqué comme acheté' : 'Article marqué comme non acheté');
        },
        onError: () => {
          message.error("Erreur lors de la mise à jour de l'article");
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
          message.success('Article supprimé');
        },
        onError: () => {
          message.error("Erreur lors de la suppression de l'article");
        },
      }
    );
  };

  const handleClearCompleted = () => {
    if (!selectedListId) return;

    clearCompletedMutation.mutate(selectedListId, {
      onSuccess: () => {
        message.success('Articles achetés supprimés');
      },
      onError: () => {
        message.error('Erreur lors de la suppression');
      },
    });
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

  // Show list view
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
