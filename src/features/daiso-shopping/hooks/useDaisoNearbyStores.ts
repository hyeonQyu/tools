import { getDaisoNearbyStoresQueryOptions } from '@/features/daiso-shopping/queries';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDaisoSelectedStore } from './useDaisoSelectedStore';

/**
 * 상품 하나에 대한 주변 매장 재고 목록.
 *
 * 다이소 매장 검색은 텍스트 키워드로만 동작하므로 지역 키워드가 반드시 필요하다.
 * 기본값은 선택한 매장 주소에서 뽑고, 사용자가 직접 바꿀 수 있다.
 * 현재 위치(GPS)는 각 매장까지의 실제 거리를 계산하고 가까운 순으로 정렬하는 데 사용한다.
 */
export const useDaisoNearbyStores = (productId: string) => {
  const { coords, status: geolocationStatus, request: requestGeolocation } = useGeolocation();
  const store = useDaisoSelectedStore();
  const [keyword, setKeyword] = useState('');

  const { data, isFetching, isError, refetch } = useQuery(
    getDaisoNearbyStoresQueryOptions({
      productId,
      keyword,
      // 위치를 받기 전에는 선택한 매장 좌표로 먼저 보여주고, 위치가 오면 그 기준으로 다시 정렬한다.
      lat: coords?.lat ?? store?.lat,
      lng: coords?.lng ?? store?.lng,
      fallbackAddress: store?.address,
    }),
  );

  return {
    keyword,
    setKeyword,
    resolvedKeyword: data?.resolvedKeyword ?? '',
    isUsingCurrentLocation: coords !== null,
    geolocationStatus,
    requestGeolocation,
    stores: data?.stores ?? [],
    onlineStock: data?.onlineStock ?? null,
    inStockCount: data?.inStockCount ?? 0,
    isFetching,
    isError,
    refetch,
  };
};
