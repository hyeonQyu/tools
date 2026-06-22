import { getServiceCreator } from '@/firebase';
import { ConstraintError, NotFoundError } from '@/lib';
import { WsServerService, WsServerServiceDependencies } from './wsServer.service.types';

export const createWsServerService = getServiceCreator<WsServerService, WsServerServiceDependencies>(({ wsServerRepository }) => ({
  create: async (payload) => {
    const existing = await wsServerRepository.findByUrl(payload.url);
    if (existing) throw new ConstraintError('이미 등록된 URL입니다.');
    await wsServerRepository.create(payload);
  },

  update: async (id, payload) => {
    const existing = await wsServerRepository.findById(id);
    if (!existing) throw new NotFoundError('서버를 찾을 수 없습니다.');
    await wsServerRepository.update(id, payload);
  },

  delete: async (id) => {
    const existing = await wsServerRepository.findById(id);
    if (!existing) throw new NotFoundError('서버를 찾을 수 없습니다.');
    await wsServerRepository.delete(id);
  },

  findAll: async () => {
    return wsServerRepository.findAll();
  },
}));
