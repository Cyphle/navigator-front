export type FamilyMemberRelation =
  | 'PARENT'
  | 'GRAND_PARENT'
  | 'CHILD'
  | 'UNCLE'
  | 'AUNT'
  | 'SISTER'
  | 'BROTHER';

export interface FamilyMember {
  id: number;
  email: string;
  relation: FamilyMemberRelation;
  isAdmin: boolean;
}

export interface Family {
  id: number;
  name: string;
  owner: FamilyMember;
  members: FamilyMember[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface FamilyMemberInput {
  email: string;
  relation: FamilyMemberRelation;
  isAdmin: boolean;
}

export interface FamilyUpsertRequest {
  name: string;
  ownerEmail: string;
  ownerName: string;
  ownerRelation: FamilyMemberRelation;
  ownerIsAdmin?: boolean;
  members: FamilyMemberInput[];
  status?: 'ACTIVE' | 'INACTIVE';
}
