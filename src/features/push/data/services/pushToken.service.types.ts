import { PushTokenRepository } from '@/features/push/data/repositories/pushToken.repository.types';
import { PushTokenPayload } from '@/features/push/types';

export interface PushTokenService {
  register: (payload: PushTokenPayload) => Promise<void>;
  unregister: (token: string) => Promise<void>;
  /** 이 기기의 워치 알림 설정. 문서가 없으면 꺼진 것으로 본다. */
  getWatchAlert: (token: string) => Promise<boolean>;
  setWatchAlert: (token: string, watchAlert: boolean) => Promise<void>;
}

export interface PushTokenServiceDependencies {
  pushTokenRepository: PushTokenRepository;
}
