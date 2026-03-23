import { Database } from '../../database/database';
import { Dashboard } from './dashboard.types';

export const getDashboardHandler = (database: Database) => (_familyId: string): Dashboard => {
  const data = database.read<Dashboard>('dashboard');
  return data[0];
}
