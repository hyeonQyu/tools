import { useCgvNotifications } from '@/features/cgv-alert/hooks';
import { CGV_TRIGGER_LABELS, getCgvOpenLink } from '@/features/cgv-alert/types';
import { Box, Chip, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

function CgvNotificationHistoryView() {
  const notifications = useCgvNotifications();

  return (
    <Box sx={{ height: '100%', overflowY: 'auto' }}>
      {notifications.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', px: 3, py: 6 }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            아직 받은 알림이 없습니다.
          </Typography>
        </Box>
      ) : (
        <List disablePadding>
          {notifications.map((notification) => (
            <ListItem key={notification.id} disablePadding divider>
              {/* 알림 클릭과 같은 동선을 타야 CGV 앱/브라우저로 열린다. (앱 안에서 바로 열면 로그아웃된 웹뷰가 뜬다) */}
              <ListItemButton
                component="a"
                href={getCgvOpenLink({ bookingUrl: notification.linkUrl, title: notification.title, body: notification.body })}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip size="small" label={CGV_TRIGGER_LABELS[notification.type]} />
                      <Typography variant="body2">{notification.title}</Typography>
                    </Stack>
                  }
                  secondary={
                    <>
                      {notification.body}
                      <br />
                      {dayjs(notification.createdAt).format('YYYY.MM.DD HH:mm')}
                    </>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default CgvNotificationHistoryView;
