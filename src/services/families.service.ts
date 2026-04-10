import { getMany, post, put } from '../helpers/http';
import type { Family, FamilyMemberRelation, UpsertFamilyRequest } from '../stores/families/families.types';

const VALID_RELATIONS: FamilyMemberRelation[] = [
  'PARENT', 'GRAND_PARENT', 'CHILD', 'UNCLE', 'AUNT', 'SISTER', 'BROTHER',
];

const toRelation = (value: unknown): FamilyMemberRelation =>
  VALID_RELATIONS.includes(value as FamilyMemberRelation)
    ? (value as FamilyMemberRelation)
    : 'PARENT';

export const getFamilies = (): Promise<Family[]> => {
  return getMany('families', responseToFamilies);
};

export const createFamily = (payload: UpsertFamilyRequest): Promise<Family> => {
  return post('families', payload, responseToFamily);
};

export const updateFamily = (id: number, payload: UpsertFamilyRequest): Promise<Family> => {
  return put(`families/${id}`, payload, responseToFamily);
};

const responseToFamily = (data: unknown): Family => {
  const mapped = responseToFamilies([data]);
  return mapped[0];
};

export const responseToFamilies = (data: unknown): Family[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((family: Record<string, unknown>, index: number) => {
    const rawCreator = ((family.owner ?? family.creator) as Record<string, unknown>) ?? {};
    return {
    id: (family.id as number) ?? index + 1,
    name: (family.name as string) ?? 'Famille',
    creator: {
      id: rawCreator.id as number ?? 1,
      usernameOrEmail: (rawCreator.username as string) ?? (rawCreator.email as string) ?? '',
      relation: toRelation(rawCreator.relation),
      isAdmin: rawCreator.isAdmin as boolean ?? true,
    },
    members: Array.isArray(family.members)
      ? (family.members as Record<string, unknown>[]).map((member, memberIndex) => ({
          id: (member.id as number) ?? memberIndex + 1,
          usernameOrEmail: (member.username as string) ?? (member.email as string) ?? '',
          relation: toRelation(member.relation),
          isAdmin: (member.isAdmin as boolean) ?? false,
        }))
      : [],
    status: family.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
  };
  });
};
