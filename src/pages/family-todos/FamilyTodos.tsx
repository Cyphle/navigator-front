import './FamilyTodos.scss';
import { useState } from 'react';
import { message } from 'antd';
import {
  useFetchAllTodoLists,
  useFetchTodoListById,
  useCreateTodoList,
  useDeleteTodoList,
  useAddItemToTodoList,
  useUpdateItemInTodoList,
  useDeleteItemFromTodoList,
  useClearCompletedTodos,
} from '../../stores/family-todos/family-todos.queries';
import { useFetchFamilies } from '../../stores/families/families.queries';
import { TodoListsView } from './components/TodoListsView';
import { CreateTodoListForm } from './components/CreateTodoListForm';
import { TodoListDetail } from './components/TodoListDetail';
import type { CreateTodoListInput, CreateTodoItemInput, TodoStatus } from '../../stores/family-todos/family-todos.types';

export const FamilyTodos = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

  const { data: lists, isPending, isError, error } = useFetchAllTodoLists();
  const { data: families } = useFetchFamilies();
  const { data: selectedList } = useFetchTodoListById(selectedListId || 0);
  const createMutation = useCreateTodoList();
  const deleteMutation = useDeleteTodoList();
  const addItemMutation = useAddItemToTodoList();
  const updateItemMutation = useUpdateItemInTodoList();
  const deleteItemMutation = useDeleteItemFromTodoList();
  const clearCompletedMutation = useClearCompletedTodos();

  const handleCreateList = (input: CreateTodoListInput) => {
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

  const handleAddItem = (input: CreateTodoItemInput) => {
    if (!selectedListId) return;

    addItemMutation.mutate(
      { listId: selectedListId, input },
      {
        onSuccess: () => {
          message.success('Tâche ajoutée');
        },
        onError: () => {
          message.error("Erreur lors de l'ajout de la tâche");
        },
      }
    );
  };

  const handleUpdateItem = (itemId: number, status: TodoStatus) => {
    if (!selectedListId) return;

    updateItemMutation.mutate(
      { listId: selectedListId, itemId, input: { status } },
      {
        onSuccess: () => {
          message.success('Tâche mise à jour');
        },
        onError: () => {
          message.error('Erreur lors de la mise à jour de la tâche');
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
          message.success('Tâche supprimée');
        },
        onError: () => {
          message.error('Erreur lors de la suppression de la tâche');
        },
      }
    );
  };

  const handleClearCompleted = () => {
    if (!selectedListId) return;

    clearCompletedMutation.mutate(selectedListId, {
      onSuccess: () => {
        message.success('Tâches terminées supprimées');
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

  if (selectedListId && selectedList) {
    return (
      <TodoListDetail
        list={selectedList}
        onBack={() => setSelectedListId(null)}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onClearCompleted={handleClearCompleted}
      />
    );
  }

  return (
    <>
      <TodoListsView
        lists={lists || []}
        onCreateNew={() => setIsFormOpen(true)}
        onSelectList={setSelectedListId}
        onDelete={handleDeleteList}
      />

      <CreateTodoListForm
        open={isFormOpen}
        onCancel={() => setIsFormOpen(false)}
        onSubmit={handleCreateList}
        isLoading={createMutation.isPending}
        families={families || []}
      />
    </>
  );
};
