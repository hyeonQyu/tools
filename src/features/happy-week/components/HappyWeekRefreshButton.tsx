import { fetchHappyWeekDocs } from '@/features/happy-week/data/happyWeekDocs.api';
import { useHappyWeekStore } from '@/features/happy-week/stores';
import { HappyWeekSnapshot } from '@/features/happy-week/types';
import { getKnownDocShas } from '@/features/happy-week/utils';
import { enqueueClosableSnackbar } from '@/styles';
import { Refresh } from '@mui/icons-material';
import { CircularProgress, IconButton } from '@mui/material';
import { useState } from 'react';

interface HappyWeekRefreshButtonProps {
  snapshot: HappyWeekSnapshot;
}

/**
 * 원본 문서의 최신본을 받아온다. 구조화 스냅샷을 다시 만들지는 않는다 —
 * 바뀐 문서를 표시하고 원문을 읽게 해줄 뿐이다. 오프라인이면 실패하고, 실패해도 앱은 그대로 돈다.
 */
function HappyWeekRefreshButton({ snapshot }: HappyWeekRefreshButtonProps) {
  const [loading, setLoading] = useState(false);
  const liveDocs = useHappyWeekStore((state) => state.liveDocs);
  const mergeLiveDocs = useHappyWeekStore((state) => state.mergeLiveDocs);

  const refresh = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetchHappyWeekDocs(getKnownDocShas(snapshot, liveDocs));
      mergeLiveDocs(response.headSha, response.fetchedAt, response.files);

      const changedSinceSnapshot = response.files.filter((file) => snapshot.meta.sourceShas[file.path] !== file.sha).length;
      enqueueClosableSnackbar({
        message:
          response.files.length === 0
            ? '변경 없음 — 스냅샷과 같다'
            : `문서 ${response.files.length}개 받음 (스냅샷 이후 변경 ${changedSinceSnapshot})`,
        variant: response.files.length === 0 ? 'info' : 'success',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      enqueueClosableSnackbar({ message: `받지 못함 — ${message}`, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IconButton onClick={() => void refresh()} disabled={loading} aria-label="원문 새로고침" sx={{ minWidth: 44, minHeight: 44 }}>
      {loading ? <CircularProgress size={20} /> : <Refresh />}
    </IconButton>
  );
}

export default HappyWeekRefreshButton;
