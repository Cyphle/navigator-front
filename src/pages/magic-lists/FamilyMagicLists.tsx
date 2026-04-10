import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  useFetchAllMagicLists,
  useFetchMagicListById,
  useCreateMagicList,
  useDeleteMagicList,
  useAddItemToMagicList,
  useUpdateItemInMagicList,
  useDeleteItemFromMagicList,
  useClearCompletedMagicListItems,
} from '../../stores/magic-lists/magic-lists.queries';
import { useFetchFamilies } from '../../stores/families/families.queries';
import { MagicListsView } from './components/MagicListsView';
import { CreateMagicListForm } from './components/CreateMagicListForm';
import { MagicListDetail } from './components/MagicListDetail';
import type { CreateMagicListInput, CreateMagicItemInput, MagicItemStatus } from '../../stores/magic-lists/magic-lists.types';
import { Loader2 } from 'lucide-react';

export const FamilyMagicLists = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: magicLists, isPending, isError } = useFetchAllMagicLists();
  const { data: families } = useFetchFamilies();
  const { data: selectedList } = useFetchMagicListById(selectedListId || 0);
  const createMutation = useCreateMagicList();
  const deleteMutation = useDeleteMagicList();
  const addItemMutation = useAddItemToMagicList();
  const updateItemMutation = useUpdateItemInMagicList();
  const deleteItemMutation = useDeleteItemFromMagicList();
  const clearCompletedMutation = useClearCompletedMagicListItems();

  const handleCreateList = (input: CreateMagicListInput) => {
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

  const handleAddItem = (input: CreateMagicItemInput) => {
    if (!selectedListId) return;
    addItemMutation.mutate(
      { listId: selectedListId, input },
      {
        onSuccess: () => toast({ title: 'Tâche ajoutée' }),
        onError: () => toast({ title: "Erreur lors de l'ajout de la tâche", variant: 'destructive' }),
      }
    );
  };

  const handleUpdateItem = (itemId: number, status: MagicItemStatus) => {
    if (!selectedListId) return;
    updateItemMutation.mutate(
      { listId: selectedListId, itemId, input: { status } },
      {
        onSuccess: () => toast({ title: 'Tâche mise à jour' }),
        onError: () => toast({ title: 'Erreur lors de la mise à jour', variant: 'destructive' }),
      }
    );
  };

  const handleDeleteItem = (itemId: number) => {
    if (!selectedListId) return;
    deleteItemMutation.mutate(
      { listId: selectedListId, itemId },
      {
        onSuccess: () => toast({ title: 'Tâche supprimée' }),
        onError: () => toast({ title: 'Erreur lors de la suppression', variant: 'destructive' }),
      }
    );
  };

  const handleClearCompleted = () => {
    if (!selectedListId) return;
    clearCompletedMutation.mutate(selectedListId, {
      onSuccess: () => toast({ title: 'Tâches terminées supprimées' }),
      onError: () => toast({ title: 'Erreur lors de la suppression', variant: 'destructive' }),
    });
  };

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 min-h-full" style={{ background: 'var(--sand)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--ocean)' }} />
        <p className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--mist)' }}>
          Chargement des listes...
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
          <p className="text-sm font-medium">Une erreur est survenue lors du chargement.</p>
        </div>
      </div>
    );
  }

  if (selectedListId && selectedList) {
    return (
      <MagicListDetail
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
      <MagicListsView
        lists={magicLists || []}
        onCreateNew={() => setIsFormOpen(true)}
        onSelectList={setSelectedListId}
        onDelete={handleDeleteList}
      />
      <CreateMagicListForm
        open={isFormOpen}
        onCancel={() => setIsFormOpen(false)}
        onSubmit={handleCreateList}
        isLoading={createMutation.isPending}
        families={families || []}
      />
    </>
  );
};
