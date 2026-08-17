import { CgvNotificationRepository, CgvWatchRepository } from '@/features/cgv-alert/data/repositories';
import { CgvNotificationEntity, CgvWatchEntity, CgvWatchPayload } from '@/features/cgv-alert/types';

export interface CgvAlertService {
  createWatch: (payload: CgvWatchPayload) => Promise<void>;
  updateWatch: (id: string, payload: CgvWatchPayload) => Promise<void>;
  setWatchEnabled: (id: string, enabled: boolean) => Promise<void>;
  deleteWatch: (id: string) => Promise<void>;
  findAllWatches: () => Promise<CgvWatchEntity[]>;
  findAllNotifications: (limitCount?: number) => Promise<CgvNotificationEntity[]>;
}

export interface CgvAlertServiceDependencies {
  cgvWatchRepository: CgvWatchRepository;
  cgvNotificationRepository: CgvNotificationRepository;
}
