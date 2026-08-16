import { getCgvNotificationFindAllQueryOptions } from '@/features/cgv-alert/queries';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useCgvNotifications = () => {
  const { data } = useSuspenseQuery(getCgvNotificationFindAllQueryOptions());
  return data;
};
