import { GoalDailyRecordsRepository, GoalPayload, GoalsRepository } from '@/features/goals-tracking/data/repositories';

export interface GoalsTrackingService {
  create: (payload: Omit<GoalPayload, 'userId'>) => Promise<void>;
}

export interface GoalsTrackingServiceDependencies {
  goalsRepository: GoalsRepository;
  goalDailyRecordsRepository: GoalDailyRecordsRepository;
}
