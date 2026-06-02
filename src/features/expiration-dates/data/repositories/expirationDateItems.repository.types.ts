import { ExpirationDateItemEntity, ExpirationDateItemPayload } from '@/features/expiration-dates/types';

export interface ExpirationDateItemsRepository {
  create: (payload: ExpirationDateItemPayload) => Promise<ExpirationDateItemEntity>;
  update: (id: string, payload: ExpirationDateItemPayload) => Promise<void>;
  delete: (id: string) => Promise<void>;
  findAll: () => Promise<ExpirationDateItemEntity[]>;
}
