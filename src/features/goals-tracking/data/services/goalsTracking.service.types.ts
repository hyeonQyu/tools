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

export type YearlyGoal = {
  goal: Omit<GoalEntity, 'userId'>;
  doneDates: Date[];
};

export interface GoalsTrackingService {
  create: (payload: GoalPayload) => Promise<void>;
  update: (goalId: string, payload: GoalPayload) => Promise<void>;
  reorder: (goalIds: string[]) => Promise<void>;
  delete: (goalId: string) => Promise<void>;
  getDailyRecords: (date: Date) => Promise<{ date: Date; goals: DailyGoal[] }>;
  completeGoal: (payload: GoalDailyRecordPayload) => Promise<void>;
  uncompleteGoal: (payload: GoalDailyRecordPayload) => Promise<void>;
  getYearlyRecords: (year: number) => Promise<{ year: number; goals: YearlyGoal[] }>;
}

export interface GoalsTrackingServiceDependencies {
  goalsRepository: GoalsRepository;
  goalDailyRecordsRepository: GoalDailyRecordsRepository;
}
