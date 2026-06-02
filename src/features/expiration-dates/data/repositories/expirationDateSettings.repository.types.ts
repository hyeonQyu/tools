import { ExpirationDateSettingsPayload } from '@/features/expiration-dates/types';

export interface ExpirationDateSettingsRepository {
  get: () => Promise<ExpirationDateSettingsPayload | null>;
  addLocation: (location: string) => Promise<void>;
  addTag: (tag: string) => Promise<void>;
}
