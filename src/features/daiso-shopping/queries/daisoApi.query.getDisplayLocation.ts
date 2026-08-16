import { daisoApiService } from '../data';
import { DAISO_API_GC_TIME, DAISO_API_QUERY_KEY, DAISO_API_STALE_TIME, DAISO_DISPLAY_LOCATION_QUERY_KEY } from './daisoApi.query.constants';

export const getDaisoDisplayLocationQueryOptions = (productId: string, storeCode: string | null, enabled = true) => ({
  queryKey: [DAISO_API_QUERY_KEY, DAISO_DISPLAY_LOCATION_QUERY_KEY, storeCode, productId] as const,
  queryFn: () => daisoApiService.getDisplayLocation({ productId, storeCode: storeCode! }),
  enabled: enabled && storeCode !== null && productId.length > 0,
  staleTime: DAISO_API_STALE_TIME.location,
  gcTime: DAISO_API_GC_TIME,
});
