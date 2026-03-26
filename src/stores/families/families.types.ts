export type FamilyMemberRelation =
  | 'PARENT'
  | 'GRAND_PARENT'
  | 'CHILD'
  | 'UNCLE'
  | 'AUNT'
  | 'SISTER'
  | 'BROTHER';

export const FAMILY_RELATION_LABELS: Record<FamilyMemberRelation, string> = {
  PARENT: 'Parent',
  GRAND_PARENT: 'Grand-parent',
  CHILD: 'Enfant',
  UNCLE: 'Oncle',
  AUNT: 'Tante',
  SISTER: 'Sœur',
  BROTHER: 'Frère',
};

export interface FamilyMember {
  id: number;
  username: string;
  relation: FamilyMemberRelation;
  isAdmin: boolean;
}

export interface Family {
  id: number;
  name: string;
  creator: FamilyMember;
  members: FamilyMember[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UpsertFamilyRequest {
  id?: number;
  name: string;
  creatorRelation: FamilyMemberRelation;
  members: UpsertFamilyMemberRequest[];
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpsertFamilyMemberRequest {
  username: string;
  relation: FamilyMemberRelation;
  isAdmin: boolean;
}
