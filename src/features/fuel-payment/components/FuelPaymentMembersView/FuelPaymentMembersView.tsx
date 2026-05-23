import { useFuelPaymentMyGroupMembers, useRemoveFuelPaymentMember } from '@/features/fuel-payment/hooks';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Box, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';

function FuelPaymentMembersView() {
  const groupMembers = useFuelPaymentMyGroupMembers();
  const handleDelete = useRemoveFuelPaymentMember();

  if (groupMembers.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>
        멤버가 없습니다.
      </Typography>
    );
  }

  return (
    <List>
      {groupMembers.map((member) => (
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
