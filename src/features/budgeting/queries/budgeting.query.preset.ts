import { budgetingPresetService } from '@/features/budgeting/data';
import { firebase } from '@/firebase';

export const getBudgetingPresetListQueryOptions = () => {
  return {
    queryKey: ['budgeting', 'presets', firebase.auth.currentUser?.uid] as const,
    queryFn: () => budgetingPresetService.findAll(),
  };
};
