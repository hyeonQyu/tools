import { firebase } from '@/firebase';
import { daisoShoppingService } from '../data';

export const getDaisoShoppingSettingsQueryOptions = () => ({
  queryKey: ['daiso-shopping', 'settings', firebase.auth.currentUser?.uid] as const,
  queryFn: () => daisoShoppingService.getSettings(),
});
