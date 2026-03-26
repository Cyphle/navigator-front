import { getMany, post, put } from '../helpers/http.ts';
import { createFamily, getFamilies, responseToFamilies, updateFamily } from './families.service.ts';

jest.mock('../helpers/http.ts', () => ({
  getMany: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
}));

describe('Families service', () => {
  test('should get families data', async () => {
    const familiesResponse = [
      {
        id: 1,
        name: 'Famille Martin',
        creator: { id: 1, username: 'sarah.martin', relation: 'PARENT', isAdmin: true },
        members: [],
        status: 'ACTIVE'
      }
    ];

    (getMany as jest.Mock).mockImplementation((_path, mapper) => Promise.resolve(mapper(familiesResponse)));

    const response = await getFamilies();

    expect(response).toEqual([
      {
        id: 1,
        name: 'Famille Martin',
        creator: { id: 1, usernameOrEmail: 'sarah.martin', relation: 'PARENT', isAdmin: true },
        members: [],
        status: 'ACTIVE'
      }
    ]);
  });

  test('should map families response', () => {
    const response = responseToFamilies([
      {
        id: 5,
        name: 'Famille Dupont',
        creator: { id: 10, username: 'claire.dupont', relation: 'PARENT', isAdmin: true },
        members: [{ id: 11, username: 'leo.dupont', relation: 'CHILD', isAdmin: false }],
        status: 'INACTIVE'
      }
    ]);

    expect(response).toEqual([
      {
        id: 5,
        name: 'Famille Dupont',
        creator: { id: 10, usernameOrEmail: 'claire.dupont', relation: 'PARENT', isAdmin: true },
        members: [{ id: 11, usernameOrEmail: 'leo.dupont', relation: 'CHILD', isAdmin: false }],
        status: 'INACTIVE'
      }
    ]);
  });

  test('should throw when request fails', async () => {
    (getMany as jest.Mock).mockRejectedValue(new Error('network'));

    await expect(getFamilies()).rejects.toThrow('network');
  });

  test('should create a family', async () => {
    (post as jest.Mock).mockResolvedValue({
      id: 10,
      name: 'Famille Test',
      creator: { id: 1, username: 'owner', relation: 'PARENT', isAdmin: true },
      members: [],
      status: 'ACTIVE'
    });

    const response = await createFamily({
      name: 'Famille Test',
      creatorRelation: 'PARENT',
      members: []
    });

    expect(post).toHaveBeenCalledWith('families', expect.anything(), expect.any(Function));
    expect(response.name).toBe('Famille Test');
  });

  test('should update a family', async () => {
    (put as jest.Mock).mockResolvedValue({
      id: 10,
      name: 'Famille Update',
      creator: { id: 1, username: 'owner', relation: 'PARENT', isAdmin: true },
      members: [],
      status: 'INACTIVE'
    });

    const response = await updateFamily(10, {
      id: 10,
      name: 'Famille Update',
      creatorRelation: 'PARENT',
      members: [],
      status: 'INACTIVE'
    });

    expect(put).toHaveBeenCalledWith('families/10', expect.anything(), expect.any(Function));
    expect(response.status).toBe('INACTIVE');
  });
});
