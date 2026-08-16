import { firebase } from '@/firebase';
import { daisoShoppingService } from '../data';

export const getDaisoShoppingItemsQueryOptions = () => ({
  queryKey: ['daiso-shopping', 'items', firebase.auth.currentUser?.uid] as const,
  queryFn: () => daisoShoppingService.findAll(),
});
