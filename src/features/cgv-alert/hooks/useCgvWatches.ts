import { getCgvWatchFindAllQueryOptions } from '@/features/cgv-alert/queries';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useCgvWatches = () => {
  const { data } = useSuspenseQuery(getCgvWatchFindAllQueryOptions());
  return data;
};
