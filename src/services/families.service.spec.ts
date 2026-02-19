import { getMany, post } from '../helpers/http.ts';
import { createFamily, getFamilies, responseToFamilies, updateFamily } from './families.service.ts';

jest.mock('../helpers/http.ts', () => ({
  getMany: jest.fn(),
  post: jest.fn(),
}));

describe('Families service', () => {
  test('should get families data', async () => {
    const families = [
      {
        id: 1,
        name: 'Famille Martin',
        owner: { id: 1, email: 'sarah.martin@banana.fr', role: 'Owner', relation: 'Owner' },
        members: [],
        status: 'ACTIVE'
      }
    ];

    (getMany as jest.Mock).mockResolvedValue(families);

    const response = await getFamilies();

    expect(response).toEqual(families);
  });

  test('should map families response', () => {
    const response = responseToFamilies([
      {
        id: 5,
        name: 'Famille Dupont',
        owner: { id: 10, email: 'claire.dupont@banana.fr', relation: 'Owner' },
        members: [{ id: 11, email: 'leo.dupont@banana.fr', relation: 'Son' }],
        status: 'INACTIVE'
      }
    ]);

    expect(response).toEqual([
      {
        id: 5,
        name: 'Famille Dupont',
        owner: { id: 10, email: 'claire.dupont@banana.fr', role: 'Owner', relation: 'Owner' },
        members: [{ id: 11, email: 'leo.dupont@banana.fr', role: 'Member', relation: 'Son' }],
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
      owner: { id: 1, email: 'owner@banana.fr', role: 'Owner', relation: 'Owner' },
      members: [],
      status: 'ACTIVE'
    });

    const response = await createFamily({
      name: 'Famille Test',
      ownerEmail: 'owner@banana.fr',
      ownerName: 'Owner',
      memberEmails: []
    });

    expect(post).toHaveBeenCalledWith('families', expect.anything(), expect.any(Function));
    expect(response.name).toBe('Famille Test');
  });

  test('should update a family', async () => {
    (post as jest.Mock).mockResolvedValue({
      id: 10,
      name: 'Famille Update',
      owner: { id: 1, email: 'owner@banana.fr', role: 'Owner', relation: 'Owner' },
      members: [],
      status: 'INACTIVE'
    });

    const response = await updateFamily(10, {
      id: 10,
      name: 'Famille Update',
      ownerEmail: 'owner@banana.fr',
      ownerName: 'Owner',
      memberEmails: [],
      status: 'INACTIVE'
    });

    expect(post).toHaveBeenCalledWith('families/10', expect.anything(), expect.any(Function));
    expect(response.status).toBe('INACTIVE');
  });
});
