import { ToolLayout } from '@/components/ToolLayout';
import {
  BudgetingBody,
  BudgetingBodySkeleton,
  BudgetingConfigButton,
  BudgetSummary,
} from '@/features/budgeting';
import { Suspense } from 'react';

function BudgetingPage() {
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
        <Suspense fallback={<BudgetingBodySkeleton />}>
          <BudgetingBody />
        </Suspense>
      </ToolLayout.Body>
    </ToolLayout>
  );
}

export default BudgetingPage;
