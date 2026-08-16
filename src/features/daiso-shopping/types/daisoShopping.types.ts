import { DocumentEntity } from '@/firebase';
import { z } from 'zod';
import { DaisoDisplayLocation } from './daisoApi.types';

/** 장보기 목록에 담아둔 물품 */
export const daisoShoppingItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  imageUrl: z.string().optional(),
  brand: z.string().optional(),
  memo: z.string(),
  /** 담기 완료 여부 */
  done: z.boolean(),
  order: z.number(),
});

export type DaisoShoppingItemPayload = z.infer<typeof daisoShoppingItemSchema>;
export type DaisoShoppingItemEntity = DocumentEntity<DaisoShoppingItemPayload> & { userId: string };

/** 자주 가는 매장 (storeCode는 재고 조회 응답에서만 얻을 수 있다) */
export const daisoSavedStoreSchema = z.object({
  storeCode: z.string(),
  storeName: z.string(),
  address: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  phone: z.string().optional(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
});

export type DaisoSavedStore = z.infer<typeof daisoSavedStoreSchema>;

export const daisoShoppingSettingsSchema = z.object({
  stores: z.array(daisoSavedStoreSchema),
  selectedStoreCode: z.string().nullable(),
});

export type DaisoShoppingSettingsPayload = z.infer<typeof daisoShoppingSettingsSchema>;

export type DaisoShoppingSortType = 'aisle' | 'added' | 'stock';

/** 선택한 매장 기준으로 합성한 물품 한 건의 상태 */
export interface DaisoItemStoreStatus {
  item: DaisoShoppingItemEntity;
  /** 선택 매장의 재고 수량. 아직 모르면 null */
  quantity: number | null;
  /** 선택 매장이 해당 상품을 취급하는지 */
  found: boolean;
  onlineStock: number | null;
  location: DaisoDisplayLocation | null;
  isStockLoading: boolean;
  isStockError: boolean;
  isLocationLoading: boolean;
  /** 진열 위치 조회를 끝냈지만 위치 정보가 없는 경우 true */
  isLocationUnknown: boolean;
  stockUpdatedAt: number | null;
  refetch: () => void;
}

export interface DaisoShoppingGroup {
  key: string;
  /** 빈 문자열이면 그룹 헤더를 렌더링하지 않는다. */
  label: string;
  statuses: DaisoItemStoreStatus[];
}
