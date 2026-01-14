import { getOne } from '../helpers/http.ts';
import { getDashboard, responseToDashboard } from './dashboard.service.ts';

jest.mock('../helpers/http.ts', () => ({
  getOne: jest.fn(),
}));

describe('Dashboard service', () => {
  test('should get dashboard data', async () => {
    (getOne as jest.Mock).mockResolvedValue({
      agenda: [],
      todos: [],
      weeklyMenu: { weekLabel: 'Jul 9', days: [] },
      recipes: [],
      shopping: { items: 0 }
    });

    const response = await getDashboard();

    expect(response).toEqual({
      agenda: [],
      todos: [],
      weeklyMenu: { weekLabel: 'Jul 9', days: [] },
      recipes: [],
      shopping: { items: 0 }
    });
  });

  test('should map dashboard response', () => {
    const response = {
      agenda: [
        {
          id: 1,
          title: 'Anniversaire',
          time: '19:30',
          person: 'Emma',
          accentColor: '#f3a6a6',
          visibility: 'FAMILY',
          attendees: ['Emma']
        }
      ],
      todos: [
        {
          id: 1,
          label: 'Sortir les poubelles',
          assignee: 'Leo',
          completed: false,
          visibility: 'FAMILY'
        }
      ],
      weeklyMenu: {
        weekLabel: 'Jul 9',
        days: [
          {
            id: 1,
            label: 'Mar. 1',
            entries: [
              {
                id: 10,
                name: 'Salade de pates',
                time: '10:00',
                person: 'Emma',
                favorite: true,
                thumbnailColor: '#d5e7d9',
                visibility: 'FAMILY'
              }
            ]
          }
        ]
      },
      recipes: [
        {
          id: 3,
          name: 'Curry vegetarien',
          favorite: true,
          selectedForWeek: true,
          visibility: 'FAMILY'
        }
      ],
      shopping: { items: 8 }
    };

    expect(responseToDashboard(response)).toEqual(response);
  });
});
