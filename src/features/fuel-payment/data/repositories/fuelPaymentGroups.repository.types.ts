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
}
