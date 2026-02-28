import { DocumentEntity } from '@/firebase';

export type GoalDailyRecordPayload = {
  userId: string;
  goalId: string;
  date: Date;
};

export type GoalDailyRecordEntity = DocumentEntity<GoalDailyRecordPayload>;

export interface GoalDailyRecordsRepository {
  findByDate: (date: Date) => Promise<GoalDailyRecordPayload[]>;
}
