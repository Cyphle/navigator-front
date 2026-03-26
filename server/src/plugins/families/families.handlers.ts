import { Database } from '../../database/database';
import { Family, FamilyMember, FamilyMemberRelation, FamilyUpsertRequest } from './families.types';

const DEFAULT_RELATION: FamilyMemberRelation = 'PARENT';

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
    relation: request.ownerRelation ?? DEFAULT_RELATION,
    isAdmin: request.ownerIsAdmin ?? true,
  };

  const members: FamilyMember[] = request.members.map((m, index) => ({
    id: nextId * 100 + 2 + index,
    email: m.email,
    relation: m.relation ?? DEFAULT_RELATION,
    isAdmin: m.isAdmin ?? false,
  }));

  const family: Family = {
    id: nextId,
    name: request.name,
    owner,
    members,
    status: request.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
  };

  return database.create<Family>('families', family);
};

export const updateFamilyHandler = (database: Database) => (id: number, request: FamilyUpsertRequest): Family | undefined => {
  const existing = database.readOneById<Family>('families', id);

  if (!existing) {
    return undefined;
  }

  const members: FamilyMember[] = request.members.map((m, index) => ({
    id: existing.members[index]?.id ?? id * 100 + 2 + index,
    email: m.email,
    relation: m.relation ?? existing.members[index]?.relation ?? DEFAULT_RELATION,
    isAdmin: m.isAdmin ?? existing.members[index]?.isAdmin ?? false,
  }));

  const updated: Family = {
    ...existing,
    name: request.name ?? existing.name,
    owner: {
      ...existing.owner,
      email: request.ownerEmail ?? existing.owner.email,
      relation: request.ownerRelation ?? existing.owner.relation,
      isAdmin: request.ownerIsAdmin ?? existing.owner.isAdmin,
    },
    members,
    status: request.status ?? existing.status,
  };

  database.update<Family>('families', id, updated);
  return updated;
};
