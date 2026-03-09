import { useOpenGoalUpdateButton } from '@/features/goals-tracking/hooks';
import { MoreVert } from '@mui/icons-material';
import { IconButton, ListItemText, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

interface GoalMenuButtonProps {
  goalId: string;
}

function GoalMenuButton({ goalId }: GoalMenuButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const openGoalUpdateButton = useOpenGoalUpdateButton();

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    openGoalUpdateButton(goalId);
  };

  const handleDelete = () => {
    handleClose();
  };

  return (
    <>
      <IconButton size="small" edge="end" onClick={handleOpen}>
        <MoreVert fontSize="small" />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>
          <ListItemText>수정</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemText sx={{ color: 'error.main' }}>삭제</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default GoalMenuButton;
