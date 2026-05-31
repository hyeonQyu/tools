import { firebase } from '@/firebase';
import { expirationDateService } from '../data';

export const getExpirationDateItemsQueryOptions = () => ({
  queryKey: ['expiration-dates', 'items', firebase.auth.currentUser?.uid] as const,
  queryFn: () => expirationDateService.findAll(),
});
