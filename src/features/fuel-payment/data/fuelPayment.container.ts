import { fuelPaymentGroupsRepository } from '@/features/fuel-payment/data/repositories';
import { createFuelPaymentService } from '@/features/fuel-payment/data/services';

export const fuelPaymentService = createFuelPaymentService({ fuelPaymentGroupsRepository });
