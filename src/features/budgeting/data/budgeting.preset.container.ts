import { budgetingPresetRepository } from './repositories';
import { createBudgetingPresetService } from './services';

export const budgetingPresetService = createBudgetingPresetService({ budgetingPresetRepository });
