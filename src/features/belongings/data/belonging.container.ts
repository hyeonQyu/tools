import { belongingItemsRepository, belongingSettingsRepository } from './repositories';
import { createBelongingService } from './services';

export const belongingService = createBelongingService({
  belongingItemsRepository,
  belongingSettingsRepository,
});
