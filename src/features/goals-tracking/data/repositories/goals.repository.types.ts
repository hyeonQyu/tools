import { DocumentEntity } from '@/firebase';

export type GoalPayload = {
  name: string;
  color: string;
};

export type GoalEntity = { userId: string } & DocumentEntity<GoalPayload>;

export interface GoalsRepository {
  create: (payload: GoalPayload) => Promise<void>;
  findByName: (name: string) => Promise<GoalEntity | null>;
  findById: (id: string) => Promise<GoalEntity | null>;
  findAll: () => Promise<GoalEntity[]>;
}
