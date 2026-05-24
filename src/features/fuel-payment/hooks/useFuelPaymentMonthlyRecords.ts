import { getFuelPaymentMyGroupQueryOptions } from '@/features/fuel-payment/queries';
import { useFuelPaymentMonthlyStore } from '@/features/fuel-payment/stores';
import { filterFuelPaymentRecordsByMonth } from '@/features/fuel-payment/utils/fuelPaymentRecord.utils';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useFuelPaymentMonthlyRecords = () => {
  const year = useFuelPaymentMonthlyStore((s) => s.year);
  const month = useFuelPaymentMonthlyStore((s) => s.month);

  const { data: myGroup } = useQuery(getFuelPaymentMyGroupQueryOptions());

  return useMemo(() => {
    return filterFuelPaymentRecordsByMonth(myGroup?.records ?? [], { year, month });
  }, [myGroup?.records, year, month]);
};
