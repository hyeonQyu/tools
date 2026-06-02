import { getServiceCreator } from '@/firebase';
import { ExpirationDateService, ExpirationDateServiceDeps } from './expirationDate.service.types';

export const createExpirationDateService = getServiceCreator<ExpirationDateService, ExpirationDateServiceDeps>(
  ({ expirationDateItemsRepository, expirationDateSettingsRepository }) => ({
    findAll: () => expirationDateItemsRepository.findAll(),

    create: async (payload) => {
      const item = await expirationDateItemsRepository.create(payload);
      if (payload.location) await expirationDateSettingsRepository.addLocation(payload.location);
      await Promise.all(payload.tags.map((tag) => expirationDateSettingsRepository.addTag(tag)));
      return item;
    },

    update: async (id, payload) => {
      await expirationDateItemsRepository.update(id, payload);
      if (payload.location) await expirationDateSettingsRepository.addLocation(payload.location);
      await Promise.all(payload.tags.map((tag) => expirationDateSettingsRepository.addTag(tag)));
    },

    delete: (id) => expirationDateItemsRepository.delete(id),

    getSettings: async () => {
      const settings = await expirationDateSettingsRepository.get();
      return settings ?? { locations: [], tags: [] };
    },
  }),
);
