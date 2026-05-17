import { getFuelPaymentMyGroupQueryOptions } from '@/features/fuel-payment/queries';
import { useFuelPaymentMonthlyStore } from '@/features/fuel-payment/stores';
import { getKstDateParts } from '@/lib';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export const useFuelPaymentMonthlyRecords = () => {
  const year = useFuelPaymentMonthlyStore((s) => s.year);
  const month = useFuelPaymentMonthlyStore((s) => s.month);

  const { data: myGroup } = useQuery(getFuelPaymentMyGroupQueryOptions());

  return useMemo(() => {
    return (myGroup?.records ?? []).filter((r) => {
      const parts = getKstDateParts(r.date);
      return parts.year === year && parts.month === month;
    });
  }, [myGroup?.records, year, month]);
}
