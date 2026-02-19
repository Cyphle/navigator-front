export type FamilyMemberRole = 'Owner' | 'Member';

export interface FamilyMember {
  id: number;
  email: string;
  role: FamilyMemberRole;
  relation?: string;
}

export interface Family {
  id: number;
  name: string;
  owner: FamilyMember;
  members: FamilyMember[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface UpsertFamilyRequest {
  id?: number;
  name: string;
  ownerEmail: string;
  ownerName: string;
  memberEmails: string[];
  status?: 'ACTIVE' | 'INACTIVE';
}
