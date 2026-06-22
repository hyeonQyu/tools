import { wsServerService } from '@/features/ws-server/data';
import { firebase } from '@/firebase';

export const getWsServerFindAllQueryOptions = () => ({
  queryKey: ['ws-server', 'findAll', firebase.auth.currentUser?.uid] as const,
  queryFn: () => wsServerService.findAll(),
});
