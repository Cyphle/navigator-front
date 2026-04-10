import type {
  MagicList,
  CreateMagicListInput,
  UpdateMagicListInput,
  CreateMagicItemInput,
  UpdateMagicItemInput,
} from '../stores/magic-lists/magic-lists.types';
import type { DashboardMagicListItem } from '../stores/dashboard/dashboard.types.ts';
import { getOne, post, put, deleteOne } from '../helpers/http';

export const getAllMagicLists = (familyId: string): Promise<MagicList[]> => {
  return getOne(`families/${encodeURIComponent(familyId)}/magic-lists`, (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map(responseToMagicList);
  });
};

export const getMagicListById = (familyId: string, id: number): Promise<MagicList> => {
  return getOne(`families/${encodeURIComponent(familyId)}/magic-lists/${id}`, responseToMagicList);
};

export const createMagicList = (familyId: string, input: CreateMagicListInput): Promise<MagicList> => {
  return post(`families/${encodeURIComponent(familyId)}/magic-lists`, input, responseToMagicList);
};

export const updateMagicList = (familyId: string, id: number, input: UpdateMagicListInput): Promise<MagicList> => {
  return put(`families/${encodeURIComponent(familyId)}/magic-lists/${id}`, input, responseToMagicList);
};

export const deleteMagicList = (familyId: string, id: number): Promise<void> => {
  return deleteOne(`families/${encodeURIComponent(familyId)}/magic-lists/${id}`);
};

export const addItemToMagicList = (
  familyId: string,
  listId: number,
  input: CreateMagicItemInput
): Promise<MagicList> => {
  return post(`families/${encodeURIComponent(familyId)}/magic-lists/${listId}/items`, input, responseToMagicList);
};

export const updateItemInMagicList = (
  familyId: string,
  listId: number,
  itemId: number,
  input: UpdateMagicItemInput
): Promise<MagicList> => {
  return put(`families/${encodeURIComponent(familyId)}/magic-lists/${listId}/items/${itemId}`, input, responseToMagicList);
};

export const deleteItemFromMagicList = (familyId: string, listId: number, itemId: number): Promise<MagicList> => {
  return deleteOne(`families/${encodeURIComponent(familyId)}/magic-lists/${listId}/items/${itemId}`, responseToMagicList);
};

export const clearCompletedMagicListItems = (familyId: string, listId: number): Promise<MagicList> => {
  return deleteOne(`families/${encodeURIComponent(familyId)}/magic-lists/${listId}/items/completed`, responseToMagicList);
};

export const getMagicListsSummary = (familyId: string): Promise<DashboardMagicListItem[]> => {
  return getOne(`families/${encodeURIComponent(familyId)}/magic-lists/summary`, (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map((item: any): DashboardMagicListItem => ({
      id: item.id,
      label: item.label,
      assignee: item.assignee,
      completed: item.completed,
      visibility: item.visibility,
    }));
  });
};

const responseToMagicList = (data: any): MagicList => ({
  id: data?.id ?? 0,
  name: data?.name ?? '',
  type: data?.type ?? 'PERSONAL',
  kind: data?.kind ?? 'SIMPLE',
  familyId: data?.familyId,
  items: Array.isArray(data?.items)
    ? data.items.map((item: any) => ({
        id: item?.id ?? 0,
        title: item?.title ?? '',
        description: item?.description,
        dueDate: item?.dueDate,
        status: item?.status ?? 'TODO',
        createdAt: item?.createdAt ?? '',
        updatedAt: item?.updatedAt ?? '',
      }))
    : [],
  createdAt: data?.createdAt ?? '',
  updatedAt: data?.updatedAt ?? '',
});
