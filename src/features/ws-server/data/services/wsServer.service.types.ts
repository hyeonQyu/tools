import { WsServerRepository, WsServerUpdatePayload } from '@/features/ws-server/data/repositories/wsServer.repository.types';
import { WsServerEntity, WsServerPayload } from '@/features/ws-server/types';

export interface WsServerService {
  create: (payload: WsServerPayload) => Promise<void>;
  update: (id: string, payload: WsServerUpdatePayload) => Promise<void>;
  delete: (id: string) => Promise<void>;
  findAll: () => Promise<WsServerEntity[]>;
}

export interface WsServerServiceDependencies {
  wsServerRepository: WsServerRepository;
}
