import { cgvAlertService } from '@/features/cgv-alert/data';
import { firebase } from '@/firebase';

export const getCgvNotificationFindAllQueryOptions = () => ({
  queryKey: ['cgv-alert', 'notification', 'findAll', firebase.auth.currentUser?.uid] as const,
  queryFn: () => cgvAlertService.findAllNotifications(),
});
