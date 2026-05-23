import { FuelPaymentGroupMember } from '@/features/fuel-payment/components/FuelPaymentRecordDialog';
import { getFuelPaymentGroupUsersQueryOptions, getFuelPaymentMyGroupQueryOptions } from '@/features/fuel-payment/queries';
import { getUsersFindAllQueryOptions } from '@/features/user/queries';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useFuelPaymentMyGroupMembers = (): FuelPaymentGroupMember[] => {
  const { data: myGroup } = useQuery(getFuelPaymentMyGroupQueryOptions());
  const { data: allUsers } = useQuery(getUsersFindAllQueryOptions());
  const { data: groupUsers } = useQuery(getFuelPaymentGroupUsersQueryOptions(myGroup?.id));

  return useMemo<FuelPaymentGroupMember[]>(() => {
    if (!myGroup || !allUsers) return [];
    const colorMap = new Map(groupUsers?.map(({ id, color }) => [id, color]) ?? []);

    return allUsers.filter(({ id }) => myGroup.userIds.includes(id)).map(({ id, name }) => ({ id, name, color: colorMap.get(id) ?? '' }));
  }, [myGroup, allUsers, groupUsers]);
}
