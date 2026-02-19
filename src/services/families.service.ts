import { getMany, post } from '../helpers/http';
import type { Family, UpsertFamilyRequest } from '../stores/families/families.types';

export const getFamilies = (): Promise<Family[]> => {
  return getMany('families', responseToFamilies);
};

export const createFamily = (payload: UpsertFamilyRequest): Promise<Family> => {
  return post('families', payload, responseToFamily);
};

export const updateFamily = (id: number, payload: UpsertFamilyRequest): Promise<Family> => {
  return post(`families/${id}`, payload, responseToFamily);
};

const responseToFamily = (data: any): Family => {
  const mapped = responseToFamilies([data]);
  return mapped[0];
};

export const responseToFamilies = (data: any): Family[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((family: any, index: number) => ({
    id: family.id ?? index + 1,
    name: family.name ?? 'Famille',
    owner: {
      id: family.owner?.id ?? 1,
      email: family.owner?.email ?? '',
      role: 'Owner',
      relation: family.owner?.relation ?? 'Owner'
    },
    members: Array.isArray(family.members)
      ? family.members.map((member: any, memberIndex: number) => ({
        id: member.id ?? memberIndex + 1,
        email: member.email ?? '',
        role: 'Member',
        relation: member.relation ?? 'Member'
      }))
      : [],
    status: family.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE'
  }));
};
