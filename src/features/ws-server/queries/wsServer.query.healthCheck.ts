import { WsServerEntity } from '@/features/ws-server/types';
import { firebase } from '@/firebase';

const HEALTH_CHECK_TIMEOUT_MS = 10_000;
const HEALTH_CHECK_TTL_MS = 10 * 60 * 1000;

export const getWsServerHealthCheckQueryOptions = (server: WsServerEntity) => ({
  queryKey: ['ws-server', 'health-check', firebase.auth.currentUser?.uid, server.id] as const,
  queryFn: async () => {
    const url = server.healthCheckEndpoint || server.url;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT_MS);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response.ok ? ('alive' as const) : ('dead' as const);
    } catch {
      clearTimeout(timeoutId);
      return 'dead' as const;
    }
  },
  enabled: false,
  staleTime: HEALTH_CHECK_TTL_MS,
  gcTime: HEALTH_CHECK_TTL_MS,
  retry: false,
});
