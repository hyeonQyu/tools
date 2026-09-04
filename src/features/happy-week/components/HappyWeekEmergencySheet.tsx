import { useHappyWeekStore } from '@/features/happy-week/stores';
import { HappyWeekContact, HappyWeekSnapshot } from '@/features/happy-week/types';
import { getContactsForDay, getDayByDateKey } from '@/features/happy-week/utils';
import { Phone } from '@mui/icons-material';
import { Box, Button, Chip, Divider, Link, Stack, TextField, Typography } from '@mui/material';

interface HappyWeekEmergencySheetProps {
  snapshot: HappyWeekSnapshot;
  dateKey: string;
}

const GROUP_LABEL: Record<HappyWeekContact['group'], string> = {
  emergency: '긴급',
  vendor: '렌터카 · 숙소 · 항공',
  insurance: '보험 · 카드',
  consulate: '영사관',
};

const GROUP_ORDER: HappyWeekContact['group'][] = ['emergency', 'vendor', 'insurance', 'consulate'];

const toTelHref = (value: string) => `tel:${value.replace(/[^+\d]/g, '')}`;

/**
 * 문서에 번호가 없는 연락처(10건)는 사용자가 현장에서 채워 넣는다.
 * 원문이 "픽업 시 계약서에서 확인해 여기 적을 것"이라 지시하는 필드들이다.
 * 스냅샷은 건드리지 않고 localStorage에만 남기며, 화면에서 겹쳐 보여준다.
 */
function ContactRow({ contact }: { contact: HappyWeekContact }) {
  const localNote = useHappyWeekStore((state) => state.localNotes[contact.id] ?? '');
  const setLocalNote = useHappyWeekStore((state) => state.setLocalNote);

  const effectiveTel = contact.tel ?? (localNote.trim() || null);

  return (
    <Box sx={{ py: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600}>
            {contact.name}
          </Typography>
          {effectiveTel ? (
            <Link href={toTelHref(effectiveTel)} variant="body1" fontFamily="monospace" fontWeight={700} sx={{ display: 'block' }}>
              {effectiveTel}
              {!contact.tel && (
                <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5, fontFamily: 'inherit' }}>
                  (직접 적음)
                </Typography>
              )}
            </Link>
          ) : (
            <Typography variant="body2" color="text.disabled">
              번호 없음
            </Typography>
          )}
        </Box>

        {effectiveTel && (
          <Button
            component="a"
            href={toTelHref(effectiveTel)}
            variant="outlined"
            size="small"
            startIcon={<Phone sx={{ fontSize: 16 }} />}
            sx={{ flexShrink: 0, minHeight: 40 }}
          >
            전화
          </Button>
        )}
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
        {contact.context}
      </Typography>

      {!contact.tel && contact.missingNote && (
        <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 0.5 }}>
          → {contact.missingNote}
        </Typography>
      )}

      {contact.fillable && (
        <TextField
          size="small"
          fullWidth
          placeholder="현장에서 확인한 번호를 여기 적어 두기"
          value={localNote}
          onChange={(event) => setLocalNote(contact.id, event.target.value)}
          inputProps={{ inputMode: 'tel', style: { fontFamily: 'monospace' } }}
          sx={{ mt: 1 }}
        />
      )}
    </Box>
  );
}

/**
 * 시트 최상단은 112 하나뿐이다. 다른 요소를 두지 않는다 — 급한 순간에 눌러야 할 것이
 * 화면에서 가장 크고 유일해야 한다. 헤더 버튼 → 이 버튼, 통화까지 2탭.
 */
function HappyWeekEmergencySheet({ snapshot, dateKey }: HappyWeekEmergencySheetProps) {
  const day = getDayByDateKey(snapshot, dateKey);
  const todayContactIds = new Set(getContactsForDay(snapshot, dateKey).map((contact) => contact.id));

  // 이동일(AIR)에는 나라별 번호가 전부 '오늘'이 되어버리므로 EU 공통만 오늘로 친다.
  const relevantToday = (contact: HappyWeekContact) => {
    if (!todayContactIds.has(contact.id)) return false;
    if (contact.scope.country === 'ALL') return true;
    if (!day || day.country === 'AIR') return false;
    return contact.scope.country === day.country;
  };

  const eu112 = snapshot.contacts.find((contact) => contact.id === 'ct.eu-emergency');

  const sections = GROUP_ORDER.map((group) => {
    const inGroup = snapshot.contacts.filter((contact) => contact.group === group && contact.id !== 'ct.eu-emergency');
    // 오늘 나라에 해당하는 것을 앞으로, 나머지는 뒤로. 숨기지는 않는다.
    const today = inGroup.filter(relevantToday);
    const rest = inGroup.filter((contact) => !relevantToday(contact));
    return { group, contacts: [...today, ...rest], todayCount: today.length };
  }).filter((section) => section.contacts.length > 0);

  return (
    <Stack spacing={2}>
      {eu112 && (
        <Button
          component="a"
          href="tel:112"
          variant="contained"
          color="error"
          size="large"
          fullWidth
          startIcon={<Phone />}
          sx={{ minHeight: 64, fontSize: '1.25rem', fontWeight: 700 }}
        >
          112 — 경찰 · 구급 · 소방
        </Button>
      )}

      <Typography variant="caption" color="text.secondary">
        EU 전역 공통 · 무료 · 영어 가능. 렌터카 사고는 112 → 사진 → Avis 순서.
      </Typography>

      {sections.map((section) => (
        <Box key={section.group}>
          <Divider sx={{ mb: 1 }}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {GROUP_LABEL[section.group]}
              </Typography>
              {section.todayCount > 0 && (
                <Chip size="small" label={`오늘 ${section.todayCount}`} sx={{ height: 18, fontSize: '0.65rem' }} />
              )}
            </Stack>
          </Divider>

          <Stack divider={<Divider flexItem />}>
            {section.contacts.map((contact) => (
              <ContactRow key={contact.id} contact={contact} />
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

export default HappyWeekEmergencySheet;
