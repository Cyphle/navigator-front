import { Database } from '../../database/database';
import { Dashboard } from './dashboard.types';

export const getDashboardHandler = (database: Database) => (): Dashboard => {
  const data = database.read<Dashboard>('dashboard');
  return data[0];
}
