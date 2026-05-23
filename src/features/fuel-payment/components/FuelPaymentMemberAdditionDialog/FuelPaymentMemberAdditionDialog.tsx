import { ColorSelector } from '@/components/ColorSelector';
import { FuelPaymentGroupEntity } from '@/features/fuel-payment/data/repositories';
import { UserEntity } from '@/features/user/data/repositories';
import { getUsersFindAllQueryOptions } from '@/features/user/queries';
import { TIME_UNIT } from '@/lib/time.defines';
import { CheckCircle, Search } from '@mui/icons-material';
import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  FormLabel,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { throttle } from 'es-toolkit';
import { useRef, useState } from 'react';

export type FuelPaymentMemberAdditionResult = {
  userId: string;
  color: string;
};

export interface FuelPaymentMemberAdditionDialogProps {
  myGroup: FuelPaymentGroupEntity;
  filterUser: (user: UserEntity) => boolean;
  close: (result?: FuelPaymentMemberAdditionResult) => void;
  onConfirm: (userId: string, color: string) => Promise<void>;
}

const MEMBER_COLORS = [
  '#ef5350',
  '#ec407a',
  '#ab47bc',
  '#7e57c2',
  '#42a5f5',
  '#26c6da',
  '#26a69a',
  '#66bb6a',
  '#d4e157',
  '#ffca28',
  '#ffa726',
  '#8d6e63',
  '#3949ab',
  '#c51162',
  '#aeea00',
  '#546e7a',
  '#e64a19',
  '#00e676',
];

function FuelPaymentMemberAdditionDialog({ filterUser, close, onConfirm }: FuelPaymentMemberAdditionDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [color, setColor] = useState(MEMBER_COLORS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredQuery, setFilteredQuery] = useState('');

  const { data: allUsers = [] } = useQuery(getUsersFindAllQueryOptions());
  const candidateMembers = allUsers.filter(filterUser);

  const updateFilteredQuery = useRef(throttle(setFilteredQuery, TIME_UNIT.unitOfMs.asSecond * 0.5)).current;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateFilteredQuery(value);
  };

  const filteredMembers = filteredQuery
    ? candidateMembers.filter((user) => user.name.toLowerCase().includes(filteredQuery.toLowerCase()))
    : candidateMembers;

  const handleConfirm = async () => {
    if (!selectedUserId) return;
    await onConfirm(selectedUserId, color);
    close({ userId: selectedUserId, color });
  };

  return (
    <>
      <DialogContent>
        <Stack spacing={3} paddingTop={2}>
          <TextField
            placeholder="이름으로 검색"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <List disablePadding sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
            {filteredMembers.map((user) => {
              const isSelected = selectedUserId === user.id;

              const { avatarBgColor, avatarColor, primaryFontWeight, primaryColor, checkIcon } = isSelected
                ? {
                    avatarBgColor: 'primary.main',
                    avatarColor: 'primary.contrastText',
                    primaryFontWeight: 600,
                    primaryColor: 'primary.main',
                    checkIcon: <CheckCircle fontSize="small" color="primary" sx={{ flexShrink: 0 }} />,
                  }
                : {
                    avatarBgColor: 'action.selected',
                    avatarColor: 'text.secondary',
                    primaryFontWeight: 400,
                    primaryColor: 'text.primary',
                    checkIcon: null,
                  };

              return (
                <ListItemButton
                  key={user.id}
                  selected={isSelected}
                  onClick={() => setSelectedUserId(user.id)}
                  sx={{
                    gap: 1.5,
                    transition: 'background-color 0.15s',
                    '&.Mui-selected': {
                      bgcolor: 'primary.50',
                    },
                    '&.Mui-selected:hover': {
                      bgcolor: 'primary.100',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: 13,
                      fontWeight: 600,
                      bgcolor: avatarBgColor,
                      color: avatarColor,
                      transition: 'background-color 0.15s, color 0.15s',
                    }}
                  >
                    {user.name[0]}
                  </Avatar>
                  <ListItemText
                    primary={user.name}
                    slotProps={{
                      primary: {
                        fontWeight: primaryFontWeight,
                        color: primaryColor,
                      },
                    }}
                  />
                  {checkIcon}
                </ListItemButton>
              );
            })}
          </List>

          <Stack spacing={1}>
            <FormLabel>색상</FormLabel>
            <ColorSelector colors={MEMBER_COLORS} value={color} onChange={setColor} />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ py: 3, px: 2 }}>
        <Button fullWidth onClick={() => close()}>
          취소
        </Button>
        <Button fullWidth onClick={handleConfirm} variant="contained" disabled={!selectedUserId}>
          추가
        </Button>
      </DialogActions>
    </>
  );
}

export default FuelPaymentMemberAdditionDialog;
