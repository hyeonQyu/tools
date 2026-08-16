import {
  DaisoDisplayLocationResult,
  DaisoProduct,
  DaisoProductSearchResult,
  DaisoSavedStore,
  DaisoStoreStock,
  DaisoStoreStockResult,
} from '@/features/daiso-shopping/types';
import { DaisoApiRepository } from '../repositories/daisoApi.repository.types';

export interface DaisoApiServiceDeps {
  daisoApiRepository: DaisoApiRepository;
}

export interface DaisoSearchStoresParams {
  keyword: string;
  /**
   * 매장 목록은 재고 조회 응답에서만 storeCode를 얻을 수 있어 상품 ID가 필요하다.
   * 목록에 담긴 상품이 있으면 그 ID를, 없으면 프로브 ID를 넘긴다.
   */
  probeProductId?: string;
  lat?: number;
  lng?: number;
}

export interface DaisoStoreStockParams {
  productId: string;
  store: DaisoSavedStore;
}

export interface DaisoNearbyStoresParams {
  productId: string;
  /** 사용자가 직접 입력한 지역 키워드. 비우면 좌표/주소에서 자동으로 해석한다. */
  keyword?: string;
  /** 현재 위치(GPS). 거리 정렬 기준이자 지역 자동 해석의 출발점이다. */
  lat?: number;
  lng?: number;
  /** GPS를 쓸 수 없을 때 지역을 해석할 대체 주소 (보통 선택한 매장 주소) */
  fallbackAddress?: string;
}

export interface DaisoNearbyStoresResult {
  stores: DaisoStoreStock[];
  onlineStock: number;
  inStockCount: number;
  /** 실제로 조회에 사용된 지역 키워드 */
  resolvedKeyword: string;
}

export interface DaisoApiService {
  searchProducts: (params: { keyword: string; page?: number }) => Promise<DaisoProductSearchResult>;
  getProduct: (productId: string) => Promise<DaisoProduct>;
  /** 지역명/매장명으로 매장을 찾는다. storeCode가 포함된 결과를 돌려준다. */
  searchStores: (params: DaisoSearchStoresParams) => Promise<DaisoStoreStock[]>;
  /** 저장한 매장 한 곳의 재고를 조회한다. */
  getStoreStock: (params: DaisoStoreStockParams) => Promise<DaisoStoreStockResult>;
  getDisplayLocation: (params: { productId: string; storeCode: string }) => Promise<DaisoDisplayLocationResult>;
  /** 지역 키워드 기준으로 매장별 재고를 가까운 순으로 돌려준다. */
  findNearbyStores: (params: DaisoNearbyStoresParams) => Promise<DaisoNearbyStoresResult>;
}
