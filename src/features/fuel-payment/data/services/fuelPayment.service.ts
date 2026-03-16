import { FuelPaymentService, FuelPaymentServiceDependencies } from '@/features/fuel-payment/data/services/fuelPayment.service.types';
import { getServiceCreator } from '@/firebase';

export const createFuelPaymentService = getServiceCreator<FuelPaymentService, FuelPaymentServiceDependencies>(
  ({ fuelPaymentGroupsRepository }) => {
    return {
      createGroup: async () => {
        return fuelPaymentGroupsRepository.create();
      },
    };
  },
);
