import { BelongingItemEntity, BelongingItemPayload } from '@/features/belongings/types';

export interface BelongingItemsRepository {
  create: (payload: BelongingItemPayload) => Promise<BelongingItemEntity>;
  update: (id: string, payload: BelongingItemPayload) => Promise<void>;
  delete: (id: string) => Promise<void>;
  findAll: () => Promise<BelongingItemEntity[]>;
}
