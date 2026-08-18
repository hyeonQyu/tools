import { PushTokenEntity, PushTokenPayload, PushTokenSettings } from '@/features/push/types';

export interface PushTokenRepository {
  /** 문서 ID가 FCM 토큰이므로 같은 토큰이 재등록되면 덮어쓴다. */
  upsert: (payload: PushTokenPayload) => Promise<void>;
  /** 기기별 알림 옵션만 갱신한다. 토큰 문서의 나머지 필드는 건드리지 않는다. */
  updateSettings: (token: string, settings: Partial<PushTokenSettings>) => Promise<void>;
  deleteByToken: (token: string) => Promise<void>;
  findByToken: (token: string) => Promise<PushTokenEntity | null>;
}
