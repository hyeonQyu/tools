import { getFuelPaymentMyGroupQueryOptions } from '@/features/fuel-payment/queries';
import { useQueryClient } from '@tanstack/react-query';

export const useRefreshMyGroupQuery = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries(getFuelPaymentMyGroupQueryOptions());
};
