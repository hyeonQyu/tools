import { useBelongingsItems } from '@/features/belongings/hooks';
import { BelongingsListView } from '../BelongingsListView';

function BelongingsBody() {
  useBelongingsItems();

  return <BelongingsListView />;
}

export default BelongingsBody;
