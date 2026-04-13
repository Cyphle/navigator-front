import type {
  MagicList,
  MagicListSummaryItem,
  CreateMagicListInput,
  UpdateMagicListInput,
  CreateMagicItemInput,
  UpdateMagicItemInput,
} from '../stores/magic-lists/magic-lists.types';
import { getOne, post, put, deleteOne } from '../helpers/http';

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

export const getMagicListsSummary = (familyId: string): Promise<MagicListSummaryItem[]> => {
  return getOne(`families/${encodeURIComponent(familyId)}/magic-lists/summary`, (data: unknown) => {
    if (!Array.isArray(data)) return [];
    return (data as Record<string, unknown>[]).map(responseToMagicListSummaryItem);
  });
};

const responseToMagicListSummaryItem = (data: Record<string, unknown>): MagicListSummaryItem => ({
  id: (data.id as number) ?? 0,
  name: (data.name as string) ?? '',
  type: (data.type as MagicListSummaryItem['type']) ?? 'PERSONAL',
  kind: (data.kind as MagicListSummaryItem['kind']) ?? 'SIMPLE',
  familyId: data.familyId as number | undefined,
  itemCount: (data.itemCount as number) ?? 0,
  createdAt: (data.createdAt as string) ?? '',
  updatedAt: (data.updatedAt as string) ?? '',
});

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
        content: item?.content,
        checked: item?.checked ?? false,
        dueDate: item?.dueDate,
        status: item?.status,
        createdAt: item?.createdAt ?? '',
        updatedAt: item?.updatedAt ?? '',
      }))
    : [],
  createdAt: data?.createdAt ?? '',
  updatedAt: data?.updatedAt ?? '',
});
