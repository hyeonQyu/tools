import {
  GoalDailyRecordPayload,
  GoalDailyRecordsRepository,
  GoalEntity,
  GoalPayload,
  GoalsRepository,
} from '@/features/goals-tracking/data/repositories';

export type DailyGoal = {
  goal: Omit<GoalEntity, 'userId'>;
  done: boolean;
};

export interface GoalsTrackingService {
  create: (payload: GoalPayload) => Promise<void>;
  getDailyRecords: (date: Date) => Promise<{ date: Date; goals: DailyGoal[] }>;
  completeGoal: (payload: GoalDailyRecordPayload) => Promise<void>;
  uncompleteGoal: (payload: GoalDailyRecordPayload) => Promise<void>;
}

export interface GoalsTrackingServiceDependencies {
  goalsRepository: GoalsRepository;
  goalDailyRecordsRepository: GoalDailyRecordsRepository;
}
