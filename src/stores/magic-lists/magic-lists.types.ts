export type MagicItemStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type MagicListType = 'SHARED' | 'PERSONAL';
export type MagicListKind = 'SIMPLE' | 'TASK' | 'TEMPLATE';

export interface MagicItem {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  status: MagicItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MagicList {
  id: number;
  name: string;
  type: MagicListType;
  kind: MagicListKind;
  familyId?: number;
  items: MagicItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMagicListInput {
  name: string;
  type: MagicListType;
  kind: MagicListKind;
  familyId?: number;
  excludedMemberIds?: number[];
}

export interface UpdateMagicListInput {
  name?: string;
}

export interface CreateMagicItemInput {
  title: string;
  description?: string;
  dueDate?: string;
  status?: MagicItemStatus;
}

export interface UpdateMagicItemInput {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: MagicItemStatus;
}
