import { ToolLayout } from '@/components/ToolLayout';
import { FuelPaymentAdditionButton } from '@/features/fuel-payment/components/FuelPaymentAdditionButton';
import { FuelPaymentViewContainer } from '@/features/fuel-payment/components/FuelPaymentViewContainer';
import { FuelPaymentViewTabs } from '@/features/fuel-payment/components/FuelPaymentViewTabs';

function FuelPaymentPage() {
  return (
    <ToolLayout>
      <ToolLayout.Header>
        <ToolLayout.Row justifyContent="space-between" alignItems="center">
          <ToolLayout.Title />
          <FuelPaymentAdditionButton />
        </ToolLayout.Row>

        <FuelPaymentViewTabs />
      </ToolLayout.Header>

      <FuelPaymentViewContainer />
    </ToolLayout>
  );
}

export default FuelPaymentPage;
