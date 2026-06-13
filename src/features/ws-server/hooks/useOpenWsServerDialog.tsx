import { SlideUpTransition } from '@/components/SlideUpTransition';
import { useDialog } from '@/dialog';
import { WsServerDialog } from '@/features/ws-server/components/WsServerDialog';
import { wsServerService } from '@/features/ws-server/data';
import { WsServerEntity } from '@/features/ws-server/types';
import { enqueueClosableSnackbar } from '@/styles';
import { useRefreshWsServerQuery } from './useRefreshWsServerQuery';

export const useOpenWsServerDialog = () => {
  const dialog = useDialog();
  const refresh = useRefreshWsServerQuery();

  const openAdd = async () => {
    await dialog.open({
      title: '서버 추가',
      content: (close) => (
        <WsServerDialog
          close={close}
          confirmLabel="추가"
          onConfirm={async ({ url, healthCheckEndpoint, displayName }) => {
            await wsServerService.create({
              url,
              healthCheckEndpoint: healthCheckEndpoint.trim() || undefined,
              displayName: displayName.trim() || undefined,
            });
            await refresh();
            enqueueClosableSnackbar({ message: '서버가 추가되었습니다.', variant: 'success' });
          }}
        />
      ),
      fullScreen: true,
      slots: { transition: SlideUpTransition },
    });
  };

  const openEdit = async (server: WsServerEntity) => {
    await dialog.open({
      title: '서버 수정',
      content: (close) => (
        <WsServerDialog
          close={close}
          initialValues={server}
          confirmLabel="저장"
          onConfirm={async ({ healthCheckEndpoint, displayName }) => {
            await wsServerService.update(server.id, {
              healthCheckEndpoint: healthCheckEndpoint.trim() || undefined,
              displayName: displayName.trim() || undefined,
            });
            await refresh();
            enqueueClosableSnackbar({ message: '서버가 수정되었습니다.', variant: 'success' });
          }}
          onDelete={async () => {
            await wsServerService.delete(server.id);
            await refresh();
            enqueueClosableSnackbar({ message: '서버가 삭제되었습니다.', variant: 'success' });
          }}
        />
      ),
      fullScreen: true,
      slots: { transition: SlideUpTransition },
    });
  };

  return { openAdd, openEdit };
};
