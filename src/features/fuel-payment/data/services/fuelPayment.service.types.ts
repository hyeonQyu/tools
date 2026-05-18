import {
  FuelPaymentGroupEntity,
  FuelPaymentGroupsRepository,
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
}

export interface FuelPaymentServiceDependencies {
  fuelPaymentGroupsRepository: FuelPaymentGroupsRepository;
  fuelPaymentUsersRepository: FuelPaymentUsersRepository;
}
