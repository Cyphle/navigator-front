export type MagicItemStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type MagicListVisibility = 'SHARED' | 'PERSONAL';
export type MagicListType = 'SIMPLE' | 'TASK' | 'TEMPLATE';

export interface MagicItem {
  id: number;
  title: string;
  content?: string;
  checked?: boolean;
  dueDate?: string;
  status?: MagicItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MagicList {
  id: number;
  name: string;
  visibility: MagicListVisibility;
  type: MagicListType;
  familyId?: number;
  items: MagicItem[];
  createdAt: string;
  updatedAt: string;
}

export interface MagicListSummaryItem {
  id: number;
  name: string;
  visibility: MagicListVisibility;
  type: MagicListType;
  familyId?: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMagicListInput {
  name: string;
  visibility: MagicListVisibility;
  type: MagicListType;
  familyId?: number;
  excludedMemberIds?: number[];
}

export interface UpdateMagicListInput {
  name?: string;
}

export interface CreateMagicItemInput {
  title: string;
  content?: string;
  checked?: boolean;
  dueDate?: string;
  status?: MagicItemStatus;
}

export interface UpdateMagicItemInput {
  title?: string;
  content?: string;
  checked?: boolean;
  dueDate?: string;
  status?: MagicItemStatus;
}
