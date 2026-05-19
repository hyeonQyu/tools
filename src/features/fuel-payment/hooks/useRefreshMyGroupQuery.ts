import { getFuelPaymentGroupUsersQueryOptions, getFuelPaymentMyGroupQueryOptions } from '@/features/fuel-payment/queries';
import { useQueryClient } from '@tanstack/react-query';

export const useRefreshMyGroupQuery = () => {
  const queryClient = useQueryClient();
  return (groupId?: string) =>
    Promise.all([
      queryClient.invalidateQueries(getFuelPaymentMyGroupQueryOptions()),
      ...(groupId ? [queryClient.invalidateQueries(getFuelPaymentGroupUsersQueryOptions(groupId))] : []),
    ]);
};
