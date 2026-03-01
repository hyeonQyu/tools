import { DocumentEntity } from '@/firebase';

export type GoalDailyRecordPayload = {
  goalId: string;
  date: Date;
};

export type GoalDailyRecordEntity = { userId: string } & DocumentEntity<GoalDailyRecordPayload>;

export interface GoalDailyRecordsRepository {
  findByDate: (date: Date) => Promise<GoalDailyRecordPayload[]>;
  create: (payload: GoalDailyRecordPayload) => Promise<void>;
  delete: (payload: GoalDailyRecordPayload) => Promise<void>;
}
