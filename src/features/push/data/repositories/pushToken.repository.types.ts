import { PushTokenEntity, PushTokenPayload } from '@/features/push/types';

export interface PushTokenRepository {
  /** 문서 ID가 FCM 토큰이므로 같은 토큰이 재등록되면 덮어쓴다. */
  upsert: (payload: PushTokenPayload) => Promise<void>;
  deleteByToken: (token: string) => Promise<void>;
  findByToken: (token: string) => Promise<PushTokenEntity | null>;
}
