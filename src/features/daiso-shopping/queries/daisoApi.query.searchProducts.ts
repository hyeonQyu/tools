import { daisoApiService } from '../data';
import { DAISO_API_GC_TIME, DAISO_API_QUERY_KEY, DAISO_API_STALE_TIME } from './daisoApi.query.constants';

export const getDaisoProductSearchQueryOptions = (keyword: string, page = 1) => {
  const trimmed = keyword.trim();

  return {
    queryKey: [DAISO_API_QUERY_KEY, 'product-search', trimmed, page] as const,
    queryFn: () => daisoApiService.searchProducts({ keyword: trimmed, page }),
    enabled: trimmed.length > 0,
    staleTime: DAISO_API_STALE_TIME.search,
    gcTime: DAISO_API_GC_TIME,
  };
};
