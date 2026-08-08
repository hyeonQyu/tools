import {
  FuelPaymentGroupEntity,
  FuelPaymentGroupsRepository,
  FuelPaymentRecord,
  FuelPaymentUserEntity,
  FuelPaymentUsersRepository,
} from '@/features/fuel-payment/data/repositories';

export interface FuelPaymentService {
  createGroup: () => Promise<FuelPaymentGroupEntity>;
  getMyGroup: () => Promise<FuelPaymentGroupEntity | null>;
  addMember: (groupId: string, userId: string, color: string) => Promise<void>;
  removeMember: (groupId: string, userId: string) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
  getGroupUsers: (groupId: string) => Promise<FuelPaymentUserEntity[]>;
  addRecord: (groupId: string, record: FuelPaymentRecord) => Promise<void>;
  updateRecord: (groupId: string, originalDate: Date, record: FuelPaymentRecord) => Promise<void>;
  removeRecord: (groupId: string, date: Date) => Promise<void>;
  updateMemo: (groupId: string, memo: string) => Promise<void>;
}

export interface FuelPaymentServiceDependencies {
  fuelPaymentGroupsRepository: FuelPaymentGroupsRepository;
  fuelPaymentUsersRepository: FuelPaymentUsersRepository;
}
