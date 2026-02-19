import { Database } from '../../database/database';
import { Family, FamilyMember, FamilyUpsertRequest } from './families.types';

export const getFamiliesHandler = (database: Database): Family[] => {
  return database.read<Family>('families');
};

export const createFamilyHandler = (database: Database) => (request: FamilyUpsertRequest): Family => {
  const families = database.read<Family>('families')
    .sort((a: Family, b: Family) => a.id - b.id)
    .reverse();

  const nextId = (families[0]?.id ?? 0) + 1;
  const owner: FamilyMember = {
    id: nextId * 100 + 1,
    email: request.ownerEmail,
    relation: request.ownerName || 'Owner'
  };

  const members: FamilyMember[] = request.memberEmails.map((email, index) => ({
    id: nextId * 100 + 2 + index,
    email,
    relation: 'Member'
  }));

  const family: Family = {
    id: nextId,
    name: request.name,
    owner,
    members,
    status: request.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE'
  };

  return database.create<Family>('families', family);
};

export const updateFamilyHandler = (database: Database) => (id: number, request: FamilyUpsertRequest): Family | undefined => {
  const existing = database.readOneById<Family>('families', id);

  if (!existing) {
    return undefined;
  }

  const members: FamilyMember[] = request.memberEmails.map((email, index) => ({
    id: existing.members[index]?.id ?? id * 100 + 2 + index,
    email,
    relation: existing.members[index]?.relation ?? 'Member'
  }));

  const updated: Family = {
    ...existing,
    name: request.name ?? existing.name,
    owner: {
      ...existing.owner,
      email: request.ownerEmail ?? existing.owner.email,
      relation: request.ownerName ?? existing.owner.relation
    },
    members,
    status: request.status ?? existing.status
  };

  database.update<Family>('families', id, updated);
  return updated;
};
