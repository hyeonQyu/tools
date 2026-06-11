import { firebase } from '@/firebase';
import { belongingService } from '../data';

export const getBelongingsItemsQueryOptions = () => ({
  queryKey: ['belongings', 'items', firebase.auth.currentUser?.uid] as const,
  queryFn: () => belongingService.findAll(),
});
