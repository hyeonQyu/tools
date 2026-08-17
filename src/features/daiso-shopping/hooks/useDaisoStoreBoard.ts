import { getDaisoDisplayLocationQueryOptions, getDaisoStoreStockQueryOptions } from '@/features/daiso-shopping/queries';
import { useDaisoShoppingStore } from '@/features/daiso-shopping/stores';
import { DaisoItemStoreStatus, DaisoSavedStore } from '@/features/daiso-shopping/types';
import { useQueries } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useDaisoSelectedStore } from './useDaisoSelectedStore';

export interface DaisoStoreBoard {
  store: DaisoSavedStore | null;
  statuses: DaisoItemStoreStatus[];
  isFetching: boolean;
  errorCount: number;
  /** 가장 오래된 재고 응답 시각. 아직 아무것도 못 받았으면 null */
  lastUpdatedAt: number | null;
  refetchAll: () => void;
}

/**
 * 선택한 매장 기준으로 담아둔 물품 전체의 재고 + 진열 위치를 모은다.
 *
 * 요청은 2단계로 나뉜다.
 * 1) 물품마다 재고 조회 (N건)
 * 2) 재고가 있는 물품만 진열 위치 조회 (M <= N건)
 * 재고가 없는 물품의 진열 위치는 쓸모가 없어 두 번째 단계를 건너뛴다.
 */
export const useDaisoStoreBoard = (): DaisoStoreBoard => {
  const items = useDaisoShoppingStore((s) => s.items);
  const store = useDaisoSelectedStore();

  const stockQueries = useQueries({
    queries: items.map((item) => getDaisoStoreStockQueryOptions(item.productId, store)),
  });

  const locationQueries = useQueries({
    queries: items.map((item, index) =>
      getDaisoDisplayLocationQueryOptions(item.productId, store?.storeCode ?? null, (stockQueries[index]?.data?.quantity ?? 0) > 0),
    ),
  });

  // refetch()는 enabled 게이트를 무시하므로, 진열 위치는 재고가 있는 항목만 직접 걸러서 다시 부른다.
  const refetchLocationIfInStock = useCallback(
    (index: number) => {
      if ((stockQueries[index]?.data?.quantity ?? 0) <= 0) return;
      locationQueries[index]?.refetch();
    },
    [stockQueries, locationQueries],
  );

  const statuses = useMemo<DaisoItemStoreStatus[]>(
    () =>
      items.map((item, index) => {
        const stockQuery = stockQueries[index];
        const locationQuery = locationQueries[index];
        const stock = stockQuery?.data;
        const location = locationQuery?.data;

        return {
          item,
          quantity: stock?.quantity ?? null,
          found: stock?.found ?? false,
          onlineStock: stock?.onlineStock ?? null,
          location: location?.locations[0] ?? null,
          isStockLoading: stockQuery?.isFetching ?? false,
          isStockError: stockQuery?.isError ?? false,
          isLocationLoading: locationQuery?.isFetching ?? false,
          isLocationUnknown: location !== undefined && !location.hasLocation,
          stockUpdatedAt: stockQuery?.dataUpdatedAt || null,
          refetch: () => {
            stockQuery?.refetch();
            refetchLocationIfInStock(index);
          },
        };
      }),
    [items, stockQueries, locationQueries, refetchLocationIfInStock],
  );

  const refetchAll = useCallback(() => {
    stockQueries.forEach((query, index) => {
      query.refetch();
      refetchLocationIfInStock(index);
    });
  }, [stockQueries, refetchLocationIfInStock]);

  const updatedTimes = stockQueries.map((query) => query.dataUpdatedAt).filter((updatedAt) => updatedAt > 0);

  return {
    store,
    statuses,
    isFetching: stockQueries.some((query) => query.isFetching) || locationQueries.some((query) => query.isFetching),
    errorCount: stockQueries.filter((query) => query.isError).length,
    lastUpdatedAt: updatedTimes.length > 0 ? Math.min(...updatedTimes) : null,
    refetchAll,
  };
};
