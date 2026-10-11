import { getDaisoRegionKeyword, rankDaisoStoresByKeyword, sortDaisoStoresByDistance } from '@/features/daiso-shopping/utils';
import { getServiceCreator } from '@/firebase';
import { DataError } from '@/lib';
import { DaisoApiService, DaisoApiServiceDeps } from './daisoApi.service.types';

/**
 * 매장 검색 전용 프로브 상품 ID.
 *
 * `/api/daiso/stores`는 storeCode를 내려주지 않고, storeCode는 `/api/daiso/inventory`에서만 얻을 수 있다.
 * 재고 조회는 productId가 필수이므로, 담긴 상품이 없을 때 쓸 더미 값이 필요하다.
 * 서버는 알 수 없는 productId를 받으면 임의 상품으로 대체해 응답하지만 매장 목록/코드는 정상적으로 내려준다.
 */
export const DAISO_STORE_PROBE_PRODUCT_ID = '0';

/** 넓은 지역 키워드도 한 번에 다 받도록 넉넉하게 잡은 페이지 크기 (서울 전체가 282개) */
const DAISO_NEARBY_PAGE_SIZE = 300;

/**
 * 키워드 없이 현재 위치 기준 목록을 만들 때 쓰는 "전체 매장" 키워드.
 * 모든 매장명이 '점'으로 끝나 한 번에 전국 매장(약 1,900곳)이 내려오고, lat/lng가 있으면 거리도 함께 계산된다.
 */
const DAISO_ALL_STORES_KEYWORD = '점';
const DAISO_ALL_STORES_PAGE_SIZE = 3000;
/** 위치 기반 기본 목록에 보여줄 매장 수 */
const DAISO_NEAREST_STORE_LIMIT = 30;

export const createDaisoApiService = getServiceCreator<DaisoApiService, DaisoApiServiceDeps>(({ daisoApiRepository }) => ({
  searchProducts: ({ keyword, page }) => daisoApiRepository.searchProducts({ keyword, page }),

  getProduct: (productId) => daisoApiRepository.getProduct(productId),

  searchStores: async ({ keyword, probeProductId, lat, lng }) => {
    const trimmed = keyword.trim();

    // 키워드가 없으면 위치 기준 가까운 매장 목록. 위치도 없으면 보여줄 기준이 없으므로 비운다.
    if (!trimmed) {
      if (lat === undefined || lng === undefined) return [];

      const { stores, totalStores } = await daisoApiRepository.getInventory({
        productId: probeProductId || DAISO_STORE_PROBE_PRODUCT_ID,
        keyword: DAISO_ALL_STORES_KEYWORD,
        lat,
        lng,
        pageSize: DAISO_ALL_STORES_PAGE_SIZE,
      });

      // 서버가 pageSize를 제한하기 시작하면 일부 매장만 받아 "가장 가까운 매장"이 틀려지므로 조용히 넘기지 않는다.
      if (stores.length < totalStores) {
        throw new DataError('매장 목록을 모두 불러오지 못했습니다. 검색으로 찾아 주세요.');
      }

      return sortDaisoStoresByDistance(stores).slice(0, DAISO_NEAREST_STORE_LIMIT);
    }

    const { stores } = await daisoApiRepository.getInventory({
      productId: probeProductId || DAISO_STORE_PROBE_PRODUCT_ID,
      keyword: trimmed,
      lat,
      lng,
      pageSize: DAISO_NEARBY_PAGE_SIZE,
    });

    return rankDaisoStoresByKeyword(stores, trimmed);
  },

  getStoreStock: async ({ productId, store }) => {
    // 재고 API에는 storeCode 필터가 없어 매장명을 키워드로 좁힌 뒤 storeCode로 골라낸다.
    const { stores, onlineStock } = await daisoApiRepository.getInventory({
      productId,
      keyword: store.storeName,
      lat: store.lat,
      lng: store.lng,
    });

    const matched = stores.find((item) => item.storeCode === store.storeCode) ?? stores.find((item) => item.storeName === store.storeName);

    return {
      found: matched !== undefined,
      quantity: matched?.quantity ?? 0,
      onlineStock,
    };
  },

  getDisplayLocation: ({ productId, storeCode }) => daisoApiRepository.getDisplayLocation({ productId, storeCode }),

  /**
   * 주변 매장 재고.
   *
   * 다이소 매장 검색은 텍스트 키워드로만 동작하고, lat/lng는 각 매장까지의 거리를 계산하는 데만 쓰인다.
   * (키워드 없이 좌표만 보내면 좌표와 무관하게 고정된 매장 한 곳만 돌아온다.)
   * 그래서 지역 키워드는 필수이고, 좌표는 "실제 내 위치에서 가까운 순"을 만드는 데 사용한다.
   */
  findNearbyStores: async ({ productId, keyword, lat, lng, fallbackAddress }) => {
    const resolvedKeyword = keyword?.trim() || getDaisoRegionKeyword(fallbackAddress ?? '');

    if (!resolvedKeyword) {
      return { stores: [], onlineStock: 0, inStockCount: 0, resolvedKeyword: '' };
    }

    const { stores, onlineStock, inStockCount } = await daisoApiRepository.getInventory({
      productId,
      keyword: resolvedKeyword,
      lat,
      lng,
      // 넓은 키워드(예: '서울')를 넣어도 전부 받아서 거리순으로 직접 정렬하기 위해 넉넉히 요청한다.
      pageSize: DAISO_NEARBY_PAGE_SIZE,
    });

    return {
      stores: sortDaisoStoresByDistance(stores),
      onlineStock,
      inStockCount,
      resolvedKeyword,
    };
  },
}));
