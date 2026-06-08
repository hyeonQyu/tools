import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import { budgetingPresetService } from '@/features/budgeting/data';
import { useRefreshBudgetingPresetListQuery } from '@/features/budgeting/hooks/useRefreshBudgetingPresetListQuery';
import { getBudgetingPresetListQueryOptions } from '@/features/budgeting/queries';
import { useBudgetingStore } from '@/features/budgeting/stores';
import { enqueueClosableSnackbar } from '@/styles';
import { MoreVert } from '@mui/icons-material';
import { IconButton, ListItemText, Menu, MenuItem } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { BudgetingConfigDialog } from '../BudgetingConfigDialog';
import { BudgetingLoadPresetDialog } from '../BudgetingLoadPresetDialog';
import { BudgetingPresetNameDialog } from '../BudgetingPresetNameDialog';

function BudgetingMenuButton() {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialog = useDialog();

  const getState = useBudgetingStore((store) => store.getState);
  const { data: presets } = useQuery(getBudgetingPresetListQueryOptions());
  const refreshPresets = useRefreshBudgetingPresetListQuery();

  const handleSave = async () => {
    setMenuOpen(false);
    await dialog.open<boolean>({
      title: '예산안 저장',
      content: (close) => (
        <BudgetingPresetNameDialog
          existingNames={(presets ?? []).map((p) => p.name)}
          close={close}
          onConfirm={async (name) => {
            await budgetingPresetService.save({ name, form: getState() });
            await refreshPresets();
            enqueueClosableSnackbar({ message: '예산안이 저장되었습니다.', variant: 'success' });
          }}
        />
      ),
    });
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
        <MenuItem onClick={handleSave}>
          <ListItemText>예산안 저장</ListItemText>
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
