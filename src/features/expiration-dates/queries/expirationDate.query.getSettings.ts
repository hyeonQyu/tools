import { firebase } from '@/firebase';
import { expirationDateService } from '../data';

export const getExpirationDateSettingsQueryOptions = () => ({
  queryKey: ['expiration-dates', 'settings', firebase.auth.currentUser?.uid] as const,
  queryFn: () => expirationDateService.getSettings(),
});
