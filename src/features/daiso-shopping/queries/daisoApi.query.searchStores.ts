import { daisoApiService } from '../data';
import { DAISO_API_GC_TIME, DAISO_API_QUERY_KEY, DAISO_API_STALE_TIME } from './daisoApi.query.constants';

export const getDaisoStoreSearchQueryOptions = (keyword: string, probeProductId?: string) => {
  const trimmed = keyword.trim();

  return {
    // probeProductId는 매장 목록 결과에 영향을 주지 않으므로 캐시 키에서 제외한다.
    queryKey: [DAISO_API_QUERY_KEY, 'store-search', trimmed] as const,
    queryFn: () => daisoApiService.searchStores({ keyword: trimmed, probeProductId }),
    enabled: trimmed.length > 0,
    staleTime: DAISO_API_STALE_TIME.search,
    gcTime: DAISO_API_GC_TIME,
  };
};
