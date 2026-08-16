import { daisoApiRepository, daisoShoppingItemsRepository, daisoShoppingSettingsRepository } from './repositories';
import { createDaisoApiService, createDaisoShoppingService } from './services';

export const daisoApiService = createDaisoApiService({
  daisoApiRepository,
});

export const daisoShoppingService = createDaisoShoppingService({
  daisoShoppingItemsRepository,
  daisoShoppingSettingsRepository,
});
