import { DocumentEntity } from '@/firebase';

export type FuelPaymentRecord = {
  date: Date;
  userId: string;
  pricePerLiter?: number;
  totalAmount?: number;
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
  addRecord: (groupId: string, record: FuelPaymentRecord) => Promise<void>;
  updateRecord: (groupId: string, originalDate: Date, record: FuelPaymentRecord) => Promise<void>;
  removeRecord: (groupId: string, date: Date) => Promise<void>;
}
