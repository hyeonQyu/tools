import { DocumentEntity } from '@/firebase';

export type GoalPayload = {
  userId: string;
  name: string;
  color: string;
};

export type GoalEntity = DocumentEntity<GoalPayload>;

export interface GoalsRepository {
  create: (payload: Omit<GoalPayload, 'userId'>) => Promise<void>;
  findByName: (name: string) => Promise<GoalEntity | null>;
  findById: (id: string) => Promise<GoalEntity | null>;
  findAll: () => Promise<GoalEntity[]>;
}
