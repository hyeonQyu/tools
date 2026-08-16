import { daisoApiService } from '../data';
import { DAISO_API_GC_TIME, DAISO_API_QUERY_KEY, DAISO_API_STALE_TIME } from './daisoApi.query.constants';

export interface DaisoNearbyStoresQueryParams {
  productId: string;
  /** 직접 입력한 지역 키워드. 비우면 좌표/주소로 자동 해석한다. */
  keyword?: string;
  lat?: number;
  lng?: number;
  fallbackAddress?: string;
}

export const getDaisoNearbyStoresQueryOptions = ({ productId, keyword, lat, lng, fallbackAddress }: DaisoNearbyStoresQueryParams) => {
  const trimmed = keyword?.trim() ?? '';

  return {
    queryKey: [
      DAISO_API_QUERY_KEY,
      'nearby-stores',
      productId,
      trimmed,
      lat ?? null,
      lng ?? null,
      trimmed ? null : (fallbackAddress ?? null),
    ] as const,
    queryFn: () => daisoApiService.findNearbyStores({ productId, keyword: trimmed, lat, lng, fallbackAddress }),
    // 키워드가 없어도 좌표나 대체 주소가 있으면 지역을 스스로 알아낼 수 있다.
    enabled: productId.length > 0 && (trimmed.length > 0 || (lat !== undefined && lng !== undefined) || Boolean(fallbackAddress)),
    staleTime: DAISO_API_STALE_TIME.stock,
    gcTime: DAISO_API_GC_TIME,
  };
};
