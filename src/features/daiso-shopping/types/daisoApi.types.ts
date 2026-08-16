import { z } from 'zod';

/** 다이소 상품 (검색/상세 공통) */
export const daisoProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().catch(0),
  imageUrl: z.string().optional(),
  brand: z.string().optional(),
  soldOut: z.boolean().catch(false),
  isNew: z.boolean().catch(false),
  pickupAvailable: z.boolean().optional(),
});

export type DaisoProduct = z.infer<typeof daisoProductSchema>;

export const daisoProductSearchResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    products: z.array(daisoProductSchema).catch([]),
  }),
  meta: z
    .object({
      total: z.number(),
      page: z.number(),
      pageSize: z.number(),
    })
    .partial()
    .optional(),
});

export const daisoProductDetailResponseSchema = z.object({
  success: z.boolean(),
  data: daisoProductSchema.extend({ currency: z.string().optional() }),
});

/**
 * 재고 조회 응답에 포함된 매장.
 * `/api/daiso/stores` 응답에는 storeCode가 없기 때문에, 이 스키마가 storeCode를 얻는 유일한 경로다.
 */
export const daisoStoreStockSchema = z.object({
  storeCode: z.string(),
  storeName: z.string(),
  address: z.string().catch(''),
  phone: z.string().optional(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  /** 기준 좌표로부터의 거리(km). 문자열로 내려온다. */
  distance: z.string().optional(),
  quantity: z.number().catch(0),
});

export type DaisoStoreStock = z.infer<typeof daisoStoreStockSchema>;

export const daisoInventoryResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    productId: z.string(),
    onlineStock: z.number().catch(0),
    storeInventory: z
      .object({
        totalStores: z.number().catch(0),
        inStockCount: z.number().catch(0),
        stores: z.array(daisoStoreStockSchema).catch([]),
      })
      .catch({ totalStores: 0, inStockCount: 0, stores: [] }),
  }),
});

/** 매장 내 진열 위치 (zoneNo: 구역 번호, stairNo: 층. 음수는 지하) */
export const daisoDisplayLocationSchema = z.object({
  zoneNo: z.string().catch(''),
  stairNo: z.string().catch(''),
  storeErp: z.string().optional(),
});

export type DaisoDisplayLocation = z.infer<typeof daisoDisplayLocationSchema>;

export const daisoDisplayLocationResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    productId: z.string(),
    storeCode: z.string(),
    hasLocation: z.boolean().catch(false),
    locations: z.array(daisoDisplayLocationSchema).catch([]),
    message: z.string().nullish(),
  }),
});

export interface DaisoProductSearchResult {
  products: DaisoProduct[];
  total: number;
}

export interface DaisoInventoryResult {
  productId: string;
  onlineStock: number;
  totalStores: number;
  inStockCount: number;
  stores: DaisoStoreStock[];
}

/** 특정 매장 한 곳의 재고 조회 결과 */
export interface DaisoStoreStockResult {
  /** 해당 매장이 응답에 존재했는지 (false면 미취급으로 간주) */
  found: boolean;
  quantity: number;
  onlineStock: number;
}

export interface DaisoDisplayLocationResult {
  hasLocation: boolean;
  locations: DaisoDisplayLocation[];
}
