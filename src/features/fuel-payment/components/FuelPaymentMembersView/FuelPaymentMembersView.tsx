import { useRemoveFuelPaymentMember } from '@/features/fuel-payment/hooks';
import { getFuelPaymentGroupUsersQueryOptions, getFuelPaymentMyGroupQueryOptions } from '@/features/fuel-payment/queries';
import { getUsersFindAllQueryOptions } from '@/features/user/queries';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Box, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

function FuelPaymentMembersView() {
  const { data: myGroup } = useQuery(getFuelPaymentMyGroupQueryOptions());
  const { data: allUsers } = useQuery(getUsersFindAllQueryOptions());
  const { data: groupUsers } = useQuery(getFuelPaymentGroupUsersQueryOptions(myGroup?.id));

  const handleDelete = useRemoveFuelPaymentMember();

  const members = useMemo(() => {
    if (!myGroup || !allUsers) return [];

    const colorMap = new Map(groupUsers?.map(({ id, color }) => [id, color]) ?? []);

    return allUsers.filter((user) => myGroup.userIds.includes(user.id)).map((user) => ({ ...user, color: colorMap.get(user.id) }));
  }, [myGroup, allUsers, groupUsers]);

  if (members.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>
        멤버가 없습니다.
      </Typography>
    );
  }

  return (
    <List>
      {members.map((member) => (
        <ListItem
          key={member.id}
          secondaryAction={
            <IconButton onClick={() => handleDelete(member.id)} color="error" size="small">
              <DeleteIcon />
            </IconButton>
          }
        >
          {member.color && (
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: member.color,
                mr: 1.5,
                flexShrink: 0,
              }}
            />
          )}
          <ListItemText primary={member.name} />
        </ListItem>
      ))}
    </List>
  );
}

export default FuelPaymentMembersView;
