import { WsServerEntity, WsServerPayload } from '@/features/ws-server/types';

export type WsServerUpdatePayload = Omit<WsServerPayload, 'url'>;

export interface WsServerRepository {
  create: (payload: WsServerPayload) => Promise<void>;
  update: (id: string, payload: WsServerUpdatePayload) => Promise<void>;
  delete: (id: string) => Promise<void>;
  findAll: () => Promise<WsServerEntity[]>;
  findById: (id: string) => Promise<WsServerEntity | null>;
  findByUrl: (url: string) => Promise<WsServerEntity | null>;
}
