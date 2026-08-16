import { PushTokenRepository } from '@/features/push/data/repositories/pushToken.repository.types';
import { PushTokenPayload } from '@/features/push/types';

export interface PushTokenService {
  register: (payload: PushTokenPayload) => Promise<void>;
  unregister: (token: string) => Promise<void>;
}

export interface PushTokenServiceDependencies {
  pushTokenRepository: PushTokenRepository;
}
