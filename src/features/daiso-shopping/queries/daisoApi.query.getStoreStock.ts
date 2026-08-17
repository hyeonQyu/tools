import { DaisoSavedStore } from '@/features/daiso-shopping/types';
import { daisoApiService } from '../data';
import { DAISO_API_GC_TIME, DAISO_API_QUERY_KEY, DAISO_API_STALE_TIME, DAISO_STORE_STOCK_QUERY_KEY } from './daisoApi.query.constants';

export const getDaisoStoreStockQueryOptions = (productId: string, store: DaisoSavedStore | null) => ({
  queryKey: [DAISO_API_QUERY_KEY, DAISO_STORE_STOCK_QUERY_KEY, store?.storeCode ?? null, productId] as const,
  queryFn: () => daisoApiService.getStoreStock({ productId, store: store! }),
  enabled: store !== null && productId.length > 0,
  staleTime: DAISO_API_STALE_TIME.stock,
  gcTime: DAISO_API_GC_TIME,
});
