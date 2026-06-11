import { BelongingSettingsPayload } from '@/features/belongings/types';

export interface BelongingSettingsRepository {
  get: () => Promise<BelongingSettingsPayload | null>;
  addLocation: (location: string) => Promise<void>;
  addTag: (tag: string) => Promise<void>;
}
