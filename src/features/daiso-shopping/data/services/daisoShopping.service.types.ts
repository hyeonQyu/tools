import {
  DaisoProduct,
  DaisoSavedStore,
  DaisoShoppingItemEntity,
  DaisoShoppingItemPayload,
  DaisoShoppingSettingsPayload,
  DaisoStoreStock,
} from '@/features/daiso-shopping/types';
import { DaisoShoppingItemsRepository } from '../repositories/daisoShoppingItems.repository.types';
import { DaisoShoppingSettingsRepository } from '../repositories/daisoShoppingSettings.repository.types';

export interface DaisoShoppingServiceDeps {
  daisoShoppingItemsRepository: DaisoShoppingItemsRepository;
  daisoShoppingSettingsRepository: DaisoShoppingSettingsRepository;
}

export interface DaisoShoppingService {
  findAll: () => Promise<DaisoShoppingItemEntity[]>;
  /** 이미 담긴 상품이면 기존 항목을 그대로 돌려준다. */
  addProduct: (product: DaisoProduct) => Promise<DaisoShoppingItemEntity>;
  update: (id: string, payload: Partial<DaisoShoppingItemPayload>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  clearDone: () => Promise<void>;
  getSettings: () => Promise<DaisoShoppingSettingsPayload>;
  /** 매장을 저장하고 곧바로 선택 상태로 만든다. */
  saveStore: (store: DaisoStoreStock | DaisoSavedStore) => Promise<void>;
  removeStore: (storeCode: string) => Promise<void>;
  selectStore: (storeCode: string | null) => Promise<void>;
}
