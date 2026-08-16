import { CgvWatchEntity, CgvWatchPayload } from '@/features/cgv-alert/types';

export interface CgvWatchRepository {
  create: (payload: CgvWatchPayload) => Promise<void>;
  update: (id: string, payload: CgvWatchPayload) => Promise<void>;
  setEnabled: (id: string, enabled: boolean) => Promise<void>;
  delete: (id: string) => Promise<void>;
  findAll: () => Promise<CgvWatchEntity[]>;
  findById: (id: string) => Promise<CgvWatchEntity | null>;
}
