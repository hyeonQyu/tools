import { FuelPaymentGroupEntity, FuelPaymentGroupsRepository } from '@/features/fuel-payment/data/repositories';

export interface FuelPaymentService {
  createGroup: () => Promise<FuelPaymentGroupEntity>;
}

export interface FuelPaymentServiceDependencies {
  fuelPaymentGroupsRepository: FuelPaymentGroupsRepository;
}
