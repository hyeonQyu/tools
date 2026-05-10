import { DocumentEntity } from '@/firebase';

export type FuelPaymentRecord = {
  date: Date;
  userId: string;
};

export type FuelPaymentGroupPayload = {
  userIds: string[];
  records: FuelPaymentRecord[];
};

export type FuelPaymentGroupEntity = DocumentEntity<FuelPaymentGroupPayload>;

export interface FuelPaymentGroupsRepository {
  create: () => Promise<FuelPaymentGroupEntity>;
  findMyGroup: () => Promise<FuelPaymentGroupEntity | null>;
  addMember: (groupId: string, userId: string) => Promise<void>;
  removeMember: (groupId: string, userId: string) => Promise<void>;
  delete: (groupId: string) => Promise<void>;
}
