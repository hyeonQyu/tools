import { GoalDailyRecordsRepository, GoalPayload, GoalsRepository } from '@/features/goals-tracking/data/repositories';

export type DailyGoal = {
  goal: Omit<GoalPayload, 'userId'>;
  done: boolean;
};

export interface GoalsTrackingService {
  create: (payload: Omit<GoalPayload, 'userId'>) => Promise<void>;
  getDailyRecords: (date: Date) => Promise<{ date: Date; goals: DailyGoal[] }>;
}

export interface GoalsTrackingServiceDependencies {
  goalsRepository: GoalsRepository;
  goalDailyRecordsRepository: GoalDailyRecordsRepository;
}
