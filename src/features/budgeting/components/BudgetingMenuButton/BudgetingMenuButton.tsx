import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import { useCreateBudgetPreset } from '@/features/budgeting/hooks/useCreateBudgetPreset';
import { MoreVert } from '@mui/icons-material';
import { IconButton, ListItemText, Menu, MenuItem } from '@mui/material';
import { useRef, useState } from 'react';
import { BudgetingConfigDialog } from '../BudgetingConfigDialog';
import { BudgetingLoadPresetDialog } from '../BudgetingLoadPresetDialog';

function BudgetingMenuButton() {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialog = useDialog();
  const createPreset = useCreateBudgetPreset();

  const handleCreateNew = async () => {
    setMenuOpen(false);
    await createPreset();
  };

  const handleLoad = async () => {
    setMenuOpen(false);
    await dialog.open<void>({
      title: '예산안 불러오기',
      content: (close) => <BudgetingLoadPresetDialog close={close} />,
      fullScreen: true,
      slots: { transition: SlideUpTransition },
    });
  };

  const handleSettings = async () => {
    setMenuOpen(false);
    await dialog.open<void>({
      title: '분배 설정',
      content: (close) => <BudgetingConfigDialog close={close} />,
      fullScreen: true,
      slots: { transition: SlideUpTransition },
    });
  };

  return (
    <>
      <IconButton ref={anchorRef} onClick={() => setMenuOpen(true)}>
        <MoreVert />
      </IconButton>
      <Menu anchorEl={anchorRef.current} open={menuOpen} onClose={() => setMenuOpen(false)}>
        <MenuItem onClick={handleCreateNew}>
          <ListItemText>새 예산안 생성</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLoad}>
          <ListItemText>예산안 불러오기</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSettings}>
          <ListItemText>설정</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default BudgetingMenuButton;
