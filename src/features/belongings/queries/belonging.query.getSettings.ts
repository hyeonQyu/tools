import { firebase } from '@/firebase';
import { belongingService } from '../data';

export const getBelongingsSettingsQueryOptions = () => ({
  queryKey: ['belongings', 'settings', firebase.auth.currentUser?.uid] as const,
  queryFn: () => belongingService.getSettings(),
});
