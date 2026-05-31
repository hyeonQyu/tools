import { ExpirationDateItemEntity, ExpirationDateItemPayload, ExpirationDateSettingsPayload } from '@/features/expiration-dates/types';
import { ExpirationDateItemsRepository } from '../repositories/expirationDateItems.repository.types';
import { ExpirationDateSettingsRepository } from '../repositories/expirationDateSettings.repository.types';

export interface ExpirationDateServiceDeps {
  expirationDateItemsRepository: ExpirationDateItemsRepository;
  expirationDateSettingsRepository: ExpirationDateSettingsRepository;
}

export interface ExpirationDateService {
  findAll: () => Promise<ExpirationDateItemEntity[]>;
  create: (payload: ExpirationDateItemPayload) => Promise<ExpirationDateItemEntity>;
  update: (id: string, payload: ExpirationDateItemPayload) => Promise<void>;
  delete: (id: string) => Promise<void>;
  getSettings: () => Promise<ExpirationDateSettingsPayload>;
}
