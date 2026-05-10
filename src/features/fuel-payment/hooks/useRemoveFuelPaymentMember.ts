import { fuelPaymentService } from '@/features/fuel-payment/data';
import { getFuelPaymentGroupUsersQueryOptions, getFuelPaymentMyGroupQueryOptions } from '@/features/fuel-payment/queries';
import { enqueueClosableSnackbar } from '@/styles';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useRemoveFuelPaymentMember = () => {
  const queryClient = useQueryClient();

  const { data: myGroup } = useQuery(getFuelPaymentMyGroupQueryOptions());

  return async (userId: string) => {
    if (!myGroup) return;

    const isLastMember = myGroup.userIds.length === 1;

    await fuelPaymentService.removeMember(myGroup.id, userId);

    if (isLastMember) {
      await fuelPaymentService.deleteGroup(myGroup.id);
    }

    await Promise.all([
      queryClient.invalidateQueries(getFuelPaymentMyGroupQueryOptions()),
      queryClient.invalidateQueries(getFuelPaymentGroupUsersQueryOptions(myGroup.id)),
    ]);

    enqueueClosableSnackbar({ message: '멤버가 삭제되었습니다.', variant: 'success' });
  };
};
