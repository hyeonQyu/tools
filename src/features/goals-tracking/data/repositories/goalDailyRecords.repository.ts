import { GoalDailyRecordsRepository } from '@/features/goals-tracking/data/repositories/goalDailyRecords.repository.types';
import { getFirebaseRepositoryCreator } from '@/firebase';

export const goalDailyRecordsRepository = getFirebaseRepositoryCreator('goalDailyRecords')<GoalDailyRecordsRepository>(({}) => {
  return {};
});
