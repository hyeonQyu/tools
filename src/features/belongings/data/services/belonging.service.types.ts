import { BelongingItemEntity, BelongingItemPayload, BelongingSettingsPayload } from '@/features/belongings/types';
import { BelongingItemsRepository } from '../repositories/belongingItems.repository.types';
import { BelongingSettingsRepository } from '../repositories/belongingSettings.repository.types';

export interface BelongingServiceDeps {
  belongingItemsRepository: BelongingItemsRepository;
  belongingSettingsRepository: BelongingSettingsRepository;
}

export interface BelongingService {
  findAll: () => Promise<BelongingItemEntity[]>;
  create: (payload: BelongingItemPayload) => Promise<BelongingItemEntity>;
  update: (id: string, payload: BelongingItemPayload) => Promise<void>;
  delete: (id: string) => Promise<void>;
  getSettings: () => Promise<BelongingSettingsPayload>;
}
