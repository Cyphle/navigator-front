export interface FamilyMember {
  id: number;
  email: string;
  relation?: string;
}

export interface Family {
  id: number;
  name: string;
  owner: FamilyMember;
  members: FamilyMember[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface FamilyUpsertRequest {
  name: string;
  ownerEmail: string;
  ownerName: string;
  memberEmails: string[];
  status?: 'ACTIVE' | 'INACTIVE';
}
