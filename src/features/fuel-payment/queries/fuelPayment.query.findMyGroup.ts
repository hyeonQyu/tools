import { fuelPaymentService } from '@/features/fuel-payment/data';

export const getFuelPaymentMyGroupQueryOptions = () => ({
  queryKey: ['fuel-payment', 'find', 'my-group'] as const,
  queryFn: () => fuelPaymentService.getMyGroup(),
});
