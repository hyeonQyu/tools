import { HAPPY_WEEK_SNAPSHOT } from '@/features/happy-week/data/snapshot';
import { useHappyWeekStore } from '@/features/happy-week/stores';
import { HappyWeekFact, HappyWeekItem } from '@/features/happy-week/types';
import { getLiveDocsForSource, getTzBadge, parseSnapshotIso, toCestTimeText } from '@/features/happy-week/utils';
import { enqueueClosableSnackbar } from '@/styles';
import { ContentCopy, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Chip, Divider, IconButton, Link, Stack, Typography } from '@mui/material';

interface HappyWeekItemSheetProps {
  item: HappyWeekItem;
}

const CONFIDENCE_LABEL: Record<HappyWeekFact['confidence'], string | null> = {
  confirmed: null,
  likely: '유력',
  undecided: '미정',
  unverified: '확인필요',
  missing: '기록 없음',
  conflicting: '자료 상충',
};

const copyToClipboard = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
    enqueueClosableSnackbar({ message: '복사했습니다', variant: 'success' });
  } catch {
    enqueueClosableSnackbar({ message: '복사에 실패했습니다', variant: 'error' });
  }
};

function FactRow({ fact }: { fact: HappyWeekFact }) {
  const confidenceLabel = CONFIDENCE_LABEL[fact.confidence];
  const isMissing = fact.confidence === 'missing';
  const canCopy = !isMissing && (fact.display === 'address' || fact.display === 'mono' || fact.display === 'tel');

  return (
    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ py: 0.5 }}>
      <Typography variant="caption" color="text.secondary" sx={{ width: 76, flexShrink: 0, pt: 0.25 }}>
        {fact.label}
      </Typography>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {isMissing ? (
          <Typography variant="body2" color="text.disabled">
            기록 없음
          </Typography>
        ) : fact.display === 'tel' ? (
          <Link href={`tel:${fact.value.replace(/[^+\d]/g, '')}`} variant="body2" fontFamily="monospace">
            {fact.value}
          </Link>
        ) : (
          <Typography
            variant="body2"
            fontFamily={fact.display === 'mono' || fact.display === 'money' ? 'monospace' : undefined}
            sx={{ wordBreak: 'break-word' }}
          >
            {fact.value}
          </Typography>
        )}

        {fact.altValue && (
          <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
            또는 {fact.altValue}
          </Typography>
        )}

        {fact.missingNote && (
          <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>
            → {fact.missingNote}
          </Typography>
        )}
      </Box>

      {confidenceLabel && (
        <Chip
          size="small"
          label={confidenceLabel}
          color={isMissing || fact.confidence === 'conflicting' ? 'warning' : 'default'}
          variant="outlined"
          sx={{ height: 20, fontSize: '0.65rem', flexShrink: 0 }}
        />
      )}

      {canCopy && (
        <IconButton size="small" onClick={() => void copyToClipboard(fact.value)} sx={{ flexShrink: 0 }}>
          <ContentCopy sx={{ fontSize: 16 }} />
        </IconButton>
      )}
    </Stack>
  );
}

function HappyWeekItemSheet({ item }: HappyWeekItemSheetProps) {
  const tzBadge = getTzBadge(item.tz);
  const timeText = item.startUtc ? toCestTimeText(parseSnapshotIso(item.startUtc)) : null;

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
        {timeText && (
          <Typography variant="h6" fontFamily="monospace">
            {timeText}
          </Typography>
        )}
        {tzBadge && <Chip size="small" color="warning" label={tzBadge} sx={{ height: 20 }} />}
        <Typography variant="body2" color="text.secondary">
          {item.timeRaw}
        </Typography>
      </Stack>

      {item.latestDepart && (
        <Alert severity="error" variant="outlined" sx={{ py: 0.5 }}>
          {item.latestDepart.label} — 이보다 늦으면 안 된다
        </Alert>
      )}

      {item.window && (
        <Alert severity={item.window.overrun === 'lost' ? 'error' : 'warning'} variant="outlined" sx={{ py: 0.5 }}>
          <Typography variant="body2" fontWeight={600}>
            {item.window.validForMin}분 유효
          </Typography>
          <Typography variant="caption">{item.window.overrunText}</Typography>
        </Alert>
      )}

      {item.headline && <Typography variant="body2">{item.headline}</Typography>}

      {item.place && (
        <Box>
          <Divider sx={{ mb: 1 }} />
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600}>
                {item.place.name}
              </Typography>
              {item.place.address && (
                <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                  {item.place.address}
                </Typography>
              )}
            </Box>
            {item.place.address && (
              <IconButton size="small" onClick={() => void copyToClipboard(item.place?.address ?? '')}>
                <ContentCopy sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Stack>
          {item.place.mapQuery && (
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
              지도 검색어: {item.place.mapQuery} (오프라인에서는 열리지 않음)
            </Typography>
          )}
        </Box>
      )}

      {item.facts.length > 0 && (
        <Box>
          <Divider sx={{ mb: 0.5 }} />
          {item.facts.map((fact, index) => (
            <FactRow key={`${fact.label}-${index}`} fact={fact} />
          ))}
        </Box>
      )}

      {item.notes.length > 0 && (
        <Box>
          <Divider sx={{ mb: 1 }} />
          <Stack spacing={0.5}>
            {item.notes.map((note, index) => (
              <Typography key={index} variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                • {note}
              </Typography>
            ))}
          </Stack>
        </Box>
      )}

      {/* 파싱이 실패했으면 headline이 null이다. 그때는 원문을 그대로 보여준다. */}
      {!item.headline && item.raw && (
        <Box>
          <Divider sx={{ mb: 1 }} />
          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {item.raw}
          </Typography>
        </Box>
      )}

      <LiveSourceDocs sourceDoc={item.sourceDoc} />

      <Typography variant="caption" color="text.disabled">
        출처: {item.sourceDoc}
      </Typography>
    </Stack>
  );
}

/**
 * 새로고침으로 받은 최신 원문. 구조화 데이터는 스냅샷 시점에 고정이므로,
 * 문서가 그 뒤에 바뀌었다면 여기서 바뀐 원문을 그대로 읽는 것이 정답이다.
 */
function LiveSourceDocs({ sourceDoc }: { sourceDoc: string }) {
  const liveDocs = useHappyWeekStore((state) => state.liveDocs);
  const docs = getLiveDocsForSource(sourceDoc, HAPPY_WEEK_SNAPSHOT, liveDocs).filter((doc) => doc.file !== null);
  if (docs.length === 0) return null;

  return (
    <Stack spacing={0.75}>
      <Divider />
      {docs.map((doc) => (
        <Accordion key={doc.path} disableGutters variant="outlined">
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Typography variant="caption" fontWeight={600}>
                최신 원문 · {doc.path.split('/').pop()}
              </Typography>
              {doc.changed && <Chip size="small" color="warning" label="스냅샷 이후 변경" sx={{ height: 18, fontSize: '0.65rem' }} />}
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Typography
              variant="caption"
              sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', display: 'block' }}
            >
              {doc.file?.content}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
}

export default HappyWeekItemSheet;
