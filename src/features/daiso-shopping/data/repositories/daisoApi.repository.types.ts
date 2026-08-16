import { DaisoDisplayLocationResult, DaisoInventoryResult, DaisoProduct, DaisoProductSearchResult } from '@/features/daiso-shopping/types';

export interface DaisoApiSearchProductsParams {
  keyword: string;
  page?: number;
  pageSize?: number;
}

export interface DaisoApiInventoryParams {
  productId: string;
  /** 지역명 또는 매장명. 없으면 lat/lng 기준 가장 가까운 매장 1곳만 내려온다. */
  keyword?: string;
  lat?: number;
  lng?: number;
  page?: number;
  pageSize?: number;
}

export interface DaisoApiDisplayLocationParams {
  productId: string;
  storeCode: string;
}

export interface DaisoApiRepository {
  searchProducts: (params: DaisoApiSearchProductsParams) => Promise<DaisoProductSearchResult>;
  getProduct: (productId: string) => Promise<DaisoProduct>;
  getInventory: (params: DaisoApiInventoryParams) => Promise<DaisoInventoryResult>;
  getDisplayLocation: (params: DaisoApiDisplayLocationParams) => Promise<DaisoDisplayLocationResult>;
}
