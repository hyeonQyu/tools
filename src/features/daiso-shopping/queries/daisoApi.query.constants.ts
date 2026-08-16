import { TIME_UNIT } from '@/lib';

/** 다이소 공개 API는 사용자와 무관한 데이터라 uid로 스코프하지 않는다. */
export const DAISO_API_QUERY_KEY = 'daiso-api';

export const DAISO_STORE_STOCK_QUERY_KEY = 'store-stock';
export const DAISO_DISPLAY_LOCATION_QUERY_KEY = 'display-location';

/** QueryClient 기본값이 staleTime: 0이므로 API 쿼리는 각자 캐시 수명을 명시한다. */
export const DAISO_API_STALE_TIME = {
  /** 재고는 매장에 서 있는 동안 바뀔 수 있어 짧게 */
  stock: TIME_UNIT.unitOfMs.asMinute * 3,
  /** 진열 구역은 거의 바뀌지 않는다 */
  location: TIME_UNIT.unitOfMs.asHour * 24,
  search: TIME_UNIT.unitOfMs.asMinute * 30,
  product: TIME_UNIT.unitOfMs.asHour * 6,
} as const;

export const DAISO_API_GC_TIME = TIME_UNIT.unitOfMs.asHour * 24;
