import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import HappyWeekSearchDialog from '@/features/happy-week/components/HappyWeekSearchDialog';
import { useHappyWeekNow } from '@/features/happy-week/hooks';
import { HappyWeekSnapshot } from '@/features/happy-week/types';
import { Search } from '@mui/icons-material';
import { IconButton } from '@mui/material';

interface HappyWeekSearchButtonProps {
  snapshot: HappyWeekSnapshot;
}

function HappyWeekSearchButton({ snapshot }: HappyWeekSearchButtonProps) {
  const dialog = useDialog();
  const now = useHappyWeekNow();

  const open = () => {
    void dialog.open({
      title: '찾기',
      fullScreen: true,
      slots: { transition: SlideUpTransition },
      content: (close) => <HappyWeekSearchDialog snapshot={snapshot} now={now} close={() => close()} />,
    });
  };

  return (
    <IconButton onClick={open} aria-label="찾기" sx={{ minWidth: 44, minHeight: 44 }}>
      <Search />
    </IconButton>
  );
}

export default HappyWeekSearchButton;
