import { pushTokenRepository } from './repositories';
import { createPushTokenService } from './services';

export const pushTokenService = createPushTokenService({ pushTokenRepository });
