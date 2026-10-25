import { keepPreviousData } from '@tanstack/react-query';
import { daisoApiService } from '../data';
import { DAISO_API_GC_TIME, DAISO_API_QUERY_KEY, DAISO_API_STALE_TIME } from './daisoApi.query.constants';

export interface DaisoStoreSearchQueryParams {
  keyword: string;
  probeProductId?: string;
  lat?: number;
  lng?: number;
}

/** 위치가 조금 흔들려도 같은 목록을 재사용하도록 소수점 셋째 자리(약 100m)까지만 키에 쓴다. */
const roundCoord = (value?: number) => (value === undefined ? undefined : Math.round(value * 1000) / 1000);

export const getDaisoStoreSearchQueryOptions = ({ keyword, probeProductId, lat, lng }: DaisoStoreSearchQueryParams) => {
  const trimmed = keyword.trim();
  // 캐시 키와 실제 요청이 같은 좌표를 쓰도록 여기서 한 번만 반올림한다.
  lat = roundCoord(lat);
  lng = roundCoord(lng);
  const hasCoords = lat !== undefined && lng !== undefined;

  return {
    // probeProductId는 매장 목록 결과에 영향을 주지 않으므로 캐시 키에서 제외한다.
    queryKey: [DAISO_API_QUERY_KEY, 'store-search', trimmed, lat ?? null, lng ?? null] as const,
    queryFn: () => daisoApiService.searchStores({ keyword: trimmed, probeProductId, lat, lng }),
    // 키워드가 없을 때는 위치가 있어야 가까운 매장 목록을 만들 수 있다.
    enabled: trimmed.length > 0 || hasCoords,
    // 위치가 늦게 도착해 키가 바뀌어도 이전 목록을 유지해 깜빡임을 막는다.
    placeholderData: keepPreviousData,
    staleTime: DAISO_API_STALE_TIME.search,
    gcTime: DAISO_API_GC_TIME,
  };
};
