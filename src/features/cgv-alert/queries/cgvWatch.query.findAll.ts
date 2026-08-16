import { cgvAlertService } from '@/features/cgv-alert/data';
import { firebase } from '@/firebase';

export const getCgvWatchFindAllQueryOptions = () => ({
  queryKey: ['cgv-alert', 'watch', 'findAll', firebase.auth.currentUser?.uid] as const,
  queryFn: () => cgvAlertService.findAllWatches(),
});
