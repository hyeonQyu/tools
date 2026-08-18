import { getServiceCreator } from '@/firebase';
import { PushTokenService, PushTokenServiceDependencies } from './pushToken.service.types';

export const createPushTokenService = getServiceCreator<PushTokenService, PushTokenServiceDependencies>(({ pushTokenRepository }) => ({
  register: async (payload) => {
    await pushTokenRepository.upsert(payload);
  },

  unregister: async (token) => {
    const existing = await pushTokenRepository.findByToken(token);
    if (!existing) return;
    await pushTokenRepository.deleteByToken(token);
  },

  getWatchAlert: async (token) => {
    const existing = await pushTokenRepository.findByToken(token);
    return existing?.watchAlert === true;
  },

  setWatchAlert: async (token, watchAlert) => {
    await pushTokenRepository.updateSettings(token, { watchAlert });
  },
}));
