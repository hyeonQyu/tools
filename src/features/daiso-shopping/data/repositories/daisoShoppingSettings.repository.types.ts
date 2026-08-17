import { DaisoSavedStore, DaisoShoppingSettingsPayload } from '@/features/daiso-shopping/types';

export interface DaisoShoppingSettingsRepository {
  get: () => Promise<DaisoShoppingSettingsPayload | null>;
  saveStores: (stores: DaisoSavedStore[]) => Promise<void>;
  selectStore: (storeCode: string | null) => Promise<void>;
}
