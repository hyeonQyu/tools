import { fuelPaymentService } from '@/features/fuel-payment/data';

export const getFuelPaymentGroupUsersQueryOptions = (groupId: string | undefined) => ({
  queryKey: ['fuel-payment', 'group-users', groupId] as const,
  queryFn: () => fuelPaymentService.getGroupUsers(groupId!),
  enabled: !!groupId,
});
