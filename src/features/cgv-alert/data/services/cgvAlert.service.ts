import { getServiceCreator } from '@/firebase';
import { ConstraintError, NotFoundError } from '@/lib';
import { CgvAlertService, CgvAlertServiceDependencies } from './cgvAlert.service.types';

const NOTIFICATION_DEFAULT_LIMIT = 100;

/** 감시 항목은 폴링 비용이 극장 수에 비례하므로 상한을 둔다. */
const MAX_WATCH_COUNT = 20;

export const createCgvAlertService = getServiceCreator<CgvAlertService, CgvAlertServiceDependencies>(
  ({ cgvWatchRepository, cgvNotificationRepository }) => ({
    createWatch: async (payload) => {
      const watches = await cgvWatchRepository.findAll();
      if (watches.length >= MAX_WATCH_COUNT) {
        throw new ConstraintError(`감시 항목은 최대 ${MAX_WATCH_COUNT}개까지 등록할 수 있습니다.`);
      }
      await cgvWatchRepository.create(payload);
    },

    updateWatch: async (id, payload) => {
      const existing = await cgvWatchRepository.findById(id);
      if (!existing) throw new NotFoundError('감시 항목을 찾을 수 없습니다.');
      await cgvWatchRepository.update(id, payload);
    },

    setWatchEnabled: async (id, enabled) => {
      const existing = await cgvWatchRepository.findById(id);
      if (!existing) throw new NotFoundError('감시 항목을 찾을 수 없습니다.');
      await cgvWatchRepository.setEnabled(id, enabled);
    },

    deleteWatch: async (id) => {
      const existing = await cgvWatchRepository.findById(id);
      if (!existing) throw new NotFoundError('감시 항목을 찾을 수 없습니다.');
      await cgvWatchRepository.delete(id);
    },

    findAllWatches: async () => {
      const watches = await cgvWatchRepository.findAll();
      return watches.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },

    findAllNotifications: async (limitCount = NOTIFICATION_DEFAULT_LIMIT) => {
      return cgvNotificationRepository.findAll(limitCount);
    },
  }),
);
