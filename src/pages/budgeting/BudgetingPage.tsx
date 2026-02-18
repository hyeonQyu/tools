import { ToolLayout } from '@/components/ToolLayout';
import {
  AllocationTypeSelector,
  BudgetingConfigButton,
  BudgetItemList,
  BudgetSummary,
  TotalAmountInput,
  useBudgetingAutoSave,
  useBudgetingLoad,
} from '@/features/budgeting';

function BudgetingPage() {
  useBudgetingLoad();
  useBudgetingAutoSave();

  return (
    <ToolLayout>
      <ToolLayout.Header>
        <ToolLayout.Row justifyContent="space-between" alignItems="center">
          <ToolLayout.Title />
          <BudgetingConfigButton />
        </ToolLayout.Row>

        <BudgetSummary />
      </ToolLayout.Header>

      <ToolLayout.Body>
        <TotalAmountInput />
        <AllocationTypeSelector />
        <BudgetItemList />
      </ToolLayout.Body>
    </ToolLayout>
  );
}

export default BudgetingPage;
