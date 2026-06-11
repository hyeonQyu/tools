import { getServiceCreator } from '@/firebase';
import { BelongingService, BelongingServiceDeps } from './belonging.service.types';

export const createBelongingService = getServiceCreator<BelongingService, BelongingServiceDeps>(
  ({ belongingItemsRepository, belongingSettingsRepository }) => ({
    findAll: () => belongingItemsRepository.findAll(),

    create: async (payload) => {
      const item = await belongingItemsRepository.create(payload);
      if (payload.location) await belongingSettingsRepository.addLocation(payload.location);
      await Promise.all(payload.tags.map((tag) => belongingSettingsRepository.addTag(tag)));
      return item;
    },

    update: async (id, payload) => {
      await belongingItemsRepository.update(id, payload);
      if (payload.location) await belongingSettingsRepository.addLocation(payload.location);
      await Promise.all(payload.tags.map((tag) => belongingSettingsRepository.addTag(tag)));
    },

    delete: (id) => belongingItemsRepository.delete(id),

    getSettings: async () => {
      const settings = await belongingSettingsRepository.get();
      return settings ?? { locations: [], tags: [] };
    },
  }),
);
