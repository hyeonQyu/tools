import { wsServerRepository } from './repositories';
import { createWsServerService } from './services';

export const wsServerService = createWsServerService({ wsServerRepository });
