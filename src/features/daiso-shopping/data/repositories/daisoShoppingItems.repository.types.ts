import { DaisoShoppingItemEntity, DaisoShoppingItemPayload } from '@/features/daiso-shopping/types';

export interface DaisoShoppingItemsRepository {
  create: (payload: DaisoShoppingItemPayload) => Promise<DaisoShoppingItemEntity>;
  update: (id: string, payload: Partial<DaisoShoppingItemPayload>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  findAll: () => Promise<DaisoShoppingItemEntity[]>;
}
