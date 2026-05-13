import { FuelPaymentGroupEntity, FuelPaymentGroupsRepository } from '@/features/fuel-payment/data/repositories';

export interface FuelPaymentService {
  createGroup: () => Promise<FuelPaymentGroupEntity>;
  getMyGroup: () => Promise<FuelPaymentGroupEntity | null>;
}

export interface FuelPaymentServiceDependencies {
  fuelPaymentGroupsRepository: FuelPaymentGroupsRepository;
}
