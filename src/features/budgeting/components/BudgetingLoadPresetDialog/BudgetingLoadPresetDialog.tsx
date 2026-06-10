import { useDialog } from '@/dialog';
import { budgetingPresetService } from '@/features/budgeting/data';
import { BudgetingPresetEntity } from '@/features/budgeting/data/repositories';
import { useRefreshBudgetingPresetListQuery } from '@/features/budgeting/hooks/useRefreshBudgetingPresetListQuery';
import { getBudgetingPresetListQueryOptions } from '@/features/budgeting/queries';
import { useBudgetingStore } from '@/features/budgeting/stores';
import { enqueueClosableSnackbar } from '@/styles';
import { MoreVert } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { BudgetingPresetNameDialog } from '../BudgetingPresetNameDialog';

interface BudgetingLoadPresetDialogProps {
  close: (result?: void) => void;
}

interface PresetItemProps {
  preset: BudgetingPresetEntity;
  onLoad: () => void;
  onRename: () => void;
  onDelete: () => void;
}

function PresetItem({ preset, onLoad, onRename, onDelete }: PresetItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <>
          <IconButton ref={anchorRef} edge="end" onClick={() => setMenuOpen(true)}>
            <MoreVert />
          </IconButton>
          <Menu anchorEl={anchorRef.current} open={menuOpen} onClose={() => setMenuOpen(false)}>
            <MenuItem
              onClick={() => {
                setMenuOpen(false);
                onRename();
              }}
            >
              이름 변경
            </MenuItem>
            <MenuItem
              onClick={() => {
                setMenuOpen(false);
                onDelete();
              }}
              sx={{ color: 'error.main' }}
            >
              삭제
            </MenuItem>
          </Menu>
        </>
      }
    >
      <ListItemButton onClick={onLoad}>
        <ListItemText primary={preset.name} />
      </ListItemButton>
    </ListItem>
  );
}

function BudgetingLoadPresetDialog({ close }: BudgetingLoadPresetDialogProps) {
  const dialog = useDialog();

  const { data: presets } = useQuery(getBudgetingPresetListQueryOptions());
  const refreshPresets = useRefreshBudgetingPresetListQuery();

  const loadPreset = useBudgetingStore((store) => store.loadPreset);
  const loadedPresetId = useBudgetingStore((store) => store.loadedPresetId);
  const clearLoadedPreset = useBudgetingStore((store) => store.clearLoadedPreset);

  const handleLoadPreset = (preset: BudgetingPresetEntity) => {
    loadPreset(preset.id, preset.form);
    enqueueClosableSnackbar({ message: `"${preset.name}" 예산안을 불러왔습니다.`, variant: 'success' });
    close();
  };

  const handleRename = async (preset: BudgetingPresetEntity) => {
    const existingNames = (presets ?? []).filter((p) => p.id !== preset.id).map((p) => p.name);

    await dialog.open<boolean>({
      title: '이름 변경',
      content: (renameClose) => (
        <BudgetingPresetNameDialog
          initialName={preset.name}
          existingNames={existingNames}
          confirmLabel="변경"
          close={renameClose}
          onConfirm={async (name) => {
            await budgetingPresetService.rename(preset.id, name);
            await refreshPresets();
            enqueueClosableSnackbar({ message: '이름이 변경되었습니다.', variant: 'success' });
          }}
        />
      ),
    });
  };

  const handleDelete = async (preset: BudgetingPresetEntity) => {
    const confirmed = await dialog.confirm({ content: `"${preset.name}" 예산안을 삭제하시겠습니까?` });
    if (!confirmed) return;

    try {
      await budgetingPresetService.delete(preset.id);
      if (loadedPresetId === preset.id) clearLoadedPreset();
      await refreshPresets();
      enqueueClosableSnackbar({ message: '예산안이 삭제되었습니다.', variant: 'success' });
    } catch {
      enqueueClosableSnackbar({ message: '삭제에 실패했습니다.', variant: 'error' });
    }
  };

  const renderContent = () => {
    if (!presets) {
      return (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
          <CircularProgress size={24} />
        </Stack>
      );
    }

    if (presets.length === 0) {
      return (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          저장된 예산안이 없습니다.
        </Typography>
      );
    }

    return (
      <List disablePadding>
        {presets.map((preset) => (
          <PresetItem
            key={preset.id}
            preset={preset}
            onLoad={() => handleLoadPreset(preset)}
            onRename={() => handleRename(preset)}
            onDelete={() => handleDelete(preset)}
          />
        ))}
      </List>
    );
  };

  return (
    <>
      <DialogContent>{renderContent()}</DialogContent>
      <DialogActions sx={{ py: 3, px: 2 }}>
        <Button fullWidth onClick={() => close()}>
          닫기
        </Button>
      </DialogActions>
    </>
  );
}

export default BudgetingLoadPresetDialog;
