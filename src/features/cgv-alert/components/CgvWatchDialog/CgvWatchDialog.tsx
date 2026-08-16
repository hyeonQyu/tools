import { CgvMovieSelector } from '@/features/cgv-alert/components/CgvMovieSelector';
import { CgvSpecialScreenSelector } from '@/features/cgv-alert/components/CgvSpecialScreenSelector';
import { CgvTheaterSelector } from '@/features/cgv-alert/components/CgvTheaterSelector';
import {
  CGV_MAX_WATCHED_DAYS,
  CGV_TRIGGER_LABELS,
  CGV_WEEKDAY_LABELS,
  CgvDateRange,
  CgvMovie,
  CgvSite,
  CgvTimeRange,
  CgvTriggerType,
  CgvWatchEntity,
  CgvWatchPayload,
  getDefaultCgvWatchFilter,
} from '@/features/cgv-alert/types';
import { ConstraintError } from '@/lib';
import {
  Alert,
  Box,
  Button,
  Chip,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const TRIGGER_DESCRIPTIONS: Record<CgvTriggerType, string> = {
  OPEN_DATE: '새로운 상영일이 열리면 알림 (예매 오픈)',
  NEW_SHOWTIME: '기존 상영일에 회차가 추가되면 알림',
  SEAT_AVAILABLE: '매진된 회차에 좌석이 생기면 알림 (취소표)',
};

const TRIGGER_ORDER: CgvTriggerType[] = ['OPEN_DATE', 'NEW_SHOWTIME', 'SEAT_AVAILABLE'];

type DateRangeType = CgvDateRange['type'];

export interface CgvWatchDialogProps {
  close: () => void;
  initialValues?: CgvWatchEntity;
  confirmLabel: string;
  onConfirm: (payload: CgvWatchPayload) => Promise<void>;
  /** 삭제가 실제로 수행되었으면 `true`. 확인 취소 시 `false`를 돌려 다이얼로그를 유지한다. */
  onDelete?: () => Promise<boolean>;
}

function CgvWatchDialog({ close, initialValues, confirmLabel, onConfirm, onDelete }: CgvWatchDialogProps) {
  const initialFilters = initialValues?.filters ?? getDefaultCgvWatchFilter();

  const [site, setSite] = useState<CgvSite | null>(
    initialValues ? { regnGrpCd: '', siteNo: initialValues.siteNo, siteNm: initialValues.siteNm } : null,
  );
  const [triggers, setTriggers] = useState<CgvTriggerType[]>(initialValues?.triggers ?? ['OPEN_DATE']);
  const [sscnsGradCds, setSscnsGradCds] = useState<string[]>(initialFilters.sscnsGradCds);
  const [movie, setMovie] = useState<CgvMovie | null>(
    initialFilters.movNo && initialFilters.movNm ? { movNo: initialFilters.movNo, movNm: initialFilters.movNm } : null,
  );
  const [dateRangeType, setDateRangeType] = useState<DateRangeType>(initialFilters.dateRange.type);
  const [withinDays, setWithinDays] = useState(
    initialFilters.dateRange.type === 'WITHIN_DAYS' ? String(initialFilters.dateRange.days) : String(CGV_MAX_WATCHED_DAYS),
  );
  const [rangeFrom, setRangeFrom] = useState(initialFilters.dateRange.type === 'RANGE' ? initialFilters.dateRange.from : '');
  const [rangeTo, setRangeTo] = useState(initialFilters.dateRange.type === 'RANGE' ? initialFilters.dateRange.to : '');
  const [weekdays, setWeekdays] = useState<number[]>(initialFilters.weekdays);
  const [useTimeRange, setUseTimeRange] = useState(initialFilters.timeRange !== null);
  const [startTm, setStartTm] = useState(initialFilters.timeRange?.startTm ?? '0000');
  const [endTm, setEndTm] = useState(initialFilters.timeRange?.endTm ?? '2359');
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const usesShowtimeTriggers = triggers.includes('NEW_SHOWTIME') || triggers.includes('SEAT_AVAILABLE');
  const isValid = site !== null && triggers.length > 0;

  const toggleTrigger = (trigger: CgvTriggerType) => {
    setTriggers((prev) => (prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]));
  };

  const toggleWeekday = (weekday: number) => {
    setWeekdays((prev) => (prev.includes(weekday) ? prev.filter((w) => w !== weekday) : [...prev, weekday]));
  };

  const buildDateRange = (): CgvDateRange => {
    if (dateRangeType === 'WITHIN_DAYS') {
      const days = Number(withinDays);
      return { type: 'WITHIN_DAYS', days: Number.isFinite(days) && days > 0 ? Math.min(days, 60) : CGV_MAX_WATCHED_DAYS };
    }
    if (dateRangeType === 'RANGE') return { type: 'RANGE', from: rangeFrom, to: rangeTo };
    return { type: 'ALL' };
  };

  const buildTimeRange = (): CgvTimeRange | null => (useTimeRange ? { startTm, endTm } : null);

  const validate = () => {
    if (dateRangeType === 'RANGE') {
      if (!/^\d{8}$/.test(rangeFrom) || !/^\d{8}$/.test(rangeTo)) return '상영일 범위는 YYYYMMDD 형식으로 입력해 주세요.';
      if (rangeFrom > rangeTo) return '상영일 범위의 시작일이 종료일보다 늦습니다.';
    }
    if (useTimeRange) {
      if (!/^\d{4}$/.test(startTm) || !/^\d{4}$/.test(endTm)) return '시간대는 HHmm 형식으로 입력해 주세요.';
      if (startTm >= endTm) return '시간대의 시작 시각이 종료 시각보다 늦습니다.';
    }
    return null;
  };

  const handleConfirm = async () => {
    if (!isValid || !site) return;

    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setLoading(true);
    try {
      await onConfirm({
        enabled: initialValues?.enabled ?? true,
        siteNo: site.siteNo,
        siteNm: site.siteNm,
        triggers,
        filters: {
          sscnsGradCds,
          movNo: movie?.movNo ?? null,
          movNm: movie?.movNm ?? null,
          dateRange: buildDateRange(),
          weekdays,
          timeRange: buildTimeRange(),
        },
      });
      close();
    } catch (e) {
      if (e instanceof ConstraintError) {
        setFormError(e.message);
      } else {
        throw e;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setLoading(true);
    try {
      const deleted = await onDelete();
      if (deleted) close();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogContent>
        <Stack spacing={3} paddingTop={2}>
          <CgvTheaterSelector value={site} onChange={setSite} />

          <Box>
            <FormLabel sx={{ display: 'block', mb: 1 }}>알림 조건</FormLabel>
            <Stack>
              {TRIGGER_ORDER.map((trigger) => (
                <FormControlLabel
                  key={trigger}
                  control={<Switch checked={triggers.includes(trigger)} onChange={() => toggleTrigger(trigger)} />}
                  label={
                    <Box>
                      <Typography variant="body2">{CGV_TRIGGER_LABELS[trigger]}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {TRIGGER_DESCRIPTIONS[trigger]}
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </Stack>
          </Box>

          <Divider />

          {triggers.includes('OPEN_DATE') && (
            <Alert severity="info">
              <strong>예매 오픈</strong> 알림은 극장에 새 상영일이 열렸는지만 보므로{' '}
              <strong>특별관·영화·시간대 조건이 적용되지 않습니다.</strong>
              {usesShowtimeTriggers
                ? ' 아래 조건은 신규 회차·취소표 알림에만 적용됩니다.'
                : ' 조건을 걸려면 신규 회차 알림을 함께 켜주세요.'}
            </Alert>
          )}

          <CgvSpecialScreenSelector siteNo={site?.siteNo ?? ''} value={sscnsGradCds} onChange={setSscnsGradCds} />

          <CgvMovieSelector value={movie} onChange={setMovie} />

          <TextField
            select
            label="상영일 범위"
            value={dateRangeType}
            onChange={(e) => setDateRangeType(e.target.value as DateRangeType)}
            fullWidth
          >
            <MenuItem value="ALL">전체 (예매 열린 모든 날짜)</MenuItem>
            <MenuItem value="WITHIN_DAYS">오늘부터 N일 이내</MenuItem>
            <MenuItem value="RANGE">특정 기간</MenuItem>
          </TextField>

          {dateRangeType === 'WITHIN_DAYS' && (
            <TextField
              label="며칠 이내"
              type="number"
              value={withinDays}
              onChange={(e) => setWithinDays(e.target.value)}
              slotProps={{ htmlInput: { min: 1, max: 60 } }}
              fullWidth
            />
          )}

          {dateRangeType === 'RANGE' && (
            <Stack direction="row" spacing={2}>
              <TextField label="시작일" placeholder="20260822" value={rangeFrom} onChange={(e) => setRangeFrom(e.target.value)} fullWidth />
              <TextField label="종료일" placeholder="20260831" value={rangeTo} onChange={(e) => setRangeTo(e.target.value)} fullWidth />
            </Stack>
          )}

          <Box>
            <FormLabel sx={{ display: 'block', mb: 1 }}>상영 요일</FormLabel>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {CGV_WEEKDAY_LABELS.map((label, weekday) => (
                <Chip
                  key={label}
                  label={label}
                  color={weekdays.includes(weekday) ? 'primary' : 'default'}
                  variant={weekdays.includes(weekday) ? 'filled' : 'outlined'}
                  onClick={() => toggleWeekday(weekday)}
                />
              ))}
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              선택하지 않으면 모든 요일을 감시합니다.
            </Typography>
          </Box>

          <Box>
            <FormControlLabel
              control={<Switch checked={useTimeRange} onChange={(e) => setUseTimeRange(e.target.checked)} />}
              label="상영 시간대 제한"
            />

            {useTimeRange && (
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <TextField label="시작 시각" placeholder="1800" value={startTm} onChange={(e) => setStartTm(e.target.value)} fullWidth />
                <TextField label="종료 시각" placeholder="2359" value={endTm} onChange={(e) => setEndTm(e.target.value)} fullWidth />
              </Stack>
            )}

            {!usesShowtimeTriggers && useTimeRange && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                시간대 제한은 회차 단위 알림(신규 회차·취소표)에만 적용됩니다.
              </Typography>
            )}
          </Box>

          {formError && <Alert severity="error">{formError}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ py: 3, px: 2, gap: 1 }}>
        {onDelete && (
          <Button color="error" onClick={handleDelete} disabled={loading} sx={{ mr: 'auto' }}>
            삭제
          </Button>
        )}
        <Button onClick={close} disabled={loading}>
          취소
        </Button>
        <Button variant="contained" onClick={handleConfirm} disabled={!isValid || loading}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </>
  );
}

export default CgvWatchDialog;
