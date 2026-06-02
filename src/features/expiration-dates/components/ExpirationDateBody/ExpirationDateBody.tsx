import { useExpirationDateItems } from '@/features/expiration-dates/hooks';
import { ExpirationDateViewContainer } from '../ExpirationDateViewContainer';

function ExpirationDateBody() {
  useExpirationDateItems();

  return <ExpirationDateViewContainer />;
}

export default ExpirationDateBody;
