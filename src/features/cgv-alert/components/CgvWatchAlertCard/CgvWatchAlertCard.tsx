import { PushNotificationState, usePushWatchAlert } from '@/features/push';
import { ExpandMore } from '@mui/icons-material';
import { Box, Button, Collapse, Paper, Stack, Switch, Typography } from '@mui/material';
import { useState } from 'react';

interface CgvWatchAlertCardProps {
  /** `usePushNotification`은 부수효과가 있어 화면당 한 번만 호출한다. 소유자가 내려 준다. */
  push: PushNotificationState;
}

/**
 * 워치 알림 설정.
 *
 * 웹 푸시로 제어할 수 있는 것은 알림을 얼마나 강하게 띄우느냐까지고, 그마저도 Android(Chrome)에서만 통한다.
 * iOS Safari는 `vibrate`/`renotify`/`requireInteraction`을 전부 무시한다.
 * 워치로 알림이 넘어가는지 자체는 어느 쪽이든 기기 설정이라 안내로만 다룰 수 있다.
 */
function CgvWatchAlertCard({ push }: CgvWatchAlertCardProps) {
  const { permission, isIos, token } = push;
  const { isEnabled, isLoaded, isSaving, toggle } = usePushWatchAlert(token);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // 알림 자체가 꺼져 있으면 `CgvPushPermissionCard`가 먼저 안내한다.
  if (permission !== 'granted') return null;

  return (
    <Paper variant="outlined" sx={{ px: 2, py: 1.5 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack>
          <Typography variant="body2" fontWeight={600}>
            워치 알림
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {token ? '알림을 지울 때까지 남겨 두고 진동을 길게 울립니다. (Android만 적용)' : '이 기기의 알림 등록을 기다리는 중입니다.'}
          </Typography>
        </Stack>

        <Switch
          checked={isEnabled}
          disabled={!token || !isLoaded || isSaving}
          onChange={(event) => toggle(event.target.checked)}
          inputProps={{ 'aria-label': '워치 알림' }}
        />
      </Stack>

      <Button
        size="small"
        color="inherit"
        onClick={() => setIsGuideOpen((open) => !open)}
        endIcon={<ExpandMore sx={{ transform: isGuideOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />}
        sx={{ mt: 0.5, ml: -1, color: 'text.secondary', fontWeight: 400 }}
      >
        <Typography variant="caption">워치에 알림이 오지 않나요?</Typography>
      </Button>

      <Collapse in={isGuideOpen}>
        <Box sx={{ pt: 0.5 }}>
          <Typography variant="caption" color="text.secondary" component="div">
            워치로 알림을 넘길지는 기기 설정이라 이 앱에서 바꿀 수 없습니다. 아래를 확인해 주세요.
          </Typography>

          <Typography variant="caption" color="text.secondary" component="ol" sx={{ pl: 2.5, my: 1 }}>
            {isIos ? (
              <>
                <li>Watch 앱 → 알림 → 목록에서 이 앱(Tools)을 켜기</li>
                <li>애플워치는 아이폰이 잠겨 있을 때만 알림을 대신 받습니다. 아이폰을 보고 있으면 워치에는 오지 않습니다.</li>
              </>
            ) : (
              <>
                <li>Wear OS(갤럭시 워치) 앱 → 알림 → 앱 알림에서 Chrome 허용</li>
                <li>워치의 방해 금지 · 극장 모드 해제</li>
                <li>워치를 손목에 착용한 상태여야 진동이 울립니다.</li>
              </>
            )}
          </Typography>

          {isIos && (
            <Typography variant="caption" color="text.secondary" component="div">
              iOS는 위 스위치의 알림 옵션이 적용되지 않습니다. 워치 도달 여부는 전적으로 이 설정에 달려 있습니다.
            </Typography>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}

export default CgvWatchAlertCard;
