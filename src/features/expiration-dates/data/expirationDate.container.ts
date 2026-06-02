import { expirationDateItemsRepository, expirationDateSettingsRepository } from './repositories';
import { createExpirationDateService } from './services';

export const expirationDateService = createExpirationDateService({
  expirationDateItemsRepository,
  expirationDateSettingsRepository,
});
