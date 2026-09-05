import { happyWeekBrowseSeed } from '@/features/happy-week/data/seed/browse.seed';
import { happyWeekContactsSeed } from '@/features/happy-week/data/seed/contacts.seed';
import { happyWeekDaysSeed } from '@/features/happy-week/data/seed/days.seed';
import { happyWeekDeadlinesSeed } from '@/features/happy-week/data/seed/deadlines.seed';
import { happyWeekDecisionsSeed } from '@/features/happy-week/data/seed/decisions.seed';
import { happyWeekGapsSeed } from '@/features/happy-week/data/seed/gaps.seed';
import { happyWeekAnchorItemsSeed } from '@/features/happy-week/data/seed/items.anchors.seed';
import { happyWeekCityItemsSeed } from '@/features/happy-week/data/seed/items.cities.seed';
import { happyWeekDolomitiItemsSeed } from '@/features/happy-week/data/seed/items.dolomiti.seed';
import { happyWeekStandbySeed } from '@/features/happy-week/data/seed/standby.seed';
import { HAPPY_WEEK_SOURCE_HEAD_SHA, HAPPY_WEEK_SOURCE_SHAS } from '@/features/happy-week/data/sourceShas';
import { HappyWeekItem, HappyWeekSnapshot } from '@/features/happy-week/types';

/**
 * 빌드타임 스냅샷. 런타임 파싱도, 네트워크 호출도 없다.
 *
 * 원본은 private 저장소 hyeonQyu/happy-week의 마크다운 30개다.
 * 시드는 `data/seed/*.seed.ts`에 나뉘어 있고 여기서 하나로 합친다.
 *
 * 무결성(Zod 스키마 + dangling 참조 + 시각 변환)은 `scripts/happy-week/validate-snapshot.ts`가
 * 검증한다. `yarn happy-week:validate`로 돌린다.
 */

const unique = (values: string[]) => Array.from(new Set(values));

/**
 * 같은 사건이 예약 문서(bookings/driving)와 도시 문서(dolomiti/cities) 양쪽에 적혀 있어
 * 서로 다른 시드에서 같은 id로 두 번 나온다. 한쪽을 버리면 정보를 잃는다 —
 * 예약 문서 쪽이 facts가 두껍고, 도시 문서 쪽이 notes와 상호참조가 두껍다.
 *
 * 그래서 더하는 필드(facts·notes·*Ids)만 합치고, **사실이 어긋나면 던진다.**
 * 두 문서가 시각이나 위험도를 다르게 적고 있다면 그건 병합할 게 아니라 사람이 봐야 할 충돌이다.
 */
const mergeItems = (items: HappyWeekItem[]): HappyWeekItem[] => {
  const byId = new Map<string, HappyWeekItem>();

  for (const item of items) {
    const existing = byId.get(item.id);

    if (!existing) {
      byId.set(item.id, item);
      continue;
    }

    const conflicts = (
      [
        ['startUtc', existing.startUtc, item.startUtc],
        ['dateKey', existing.dateKey, item.dateKey],
        ['severity', existing.severity, item.severity],
        ['kind', existing.kind, item.kind],
      ] as const
    ).filter(([, a, b]) => a !== b);

    if (conflicts.length > 0) {
      const detail = conflicts.map(([field, a, b]) => `${field}: ${String(a)} vs ${String(b)}`).join(', ');
      throw new Error(`[happy-week] 중복 아이템 '${item.id}'의 사실이 어긋난다 — ${detail}`);
    }

    // facts가 많은 쪽을 뼈대로 삼는다. 예약 문서가 대체로 여기 해당한다.
    const base = existing.facts.length >= item.facts.length ? existing : item;
    const other = base === existing ? item : existing;

    byId.set(item.id, {
      ...base,
      icon: base.icon ?? other.icon,
      headline: base.headline ?? other.headline,
      latestDepart: base.latestDepart ?? other.latestDepart,
      window: base.window ?? other.window,
      place: base.place ?? other.place,
      notes: unique([...base.notes, ...other.notes]),
      linkedItemIds: unique([...base.linkedItemIds, ...other.linkedItemIds]),
      deadlineIds: unique([...base.deadlineIds, ...other.deadlineIds]),
      procedureIds: unique([...base.procedureIds, ...other.procedureIds]),
      contactIds: unique([...base.contactIds, ...other.contactIds]),
      sourceDoc: unique([base.sourceDoc, other.sourceDoc]).join(' + '),
      raw: base.raw.length >= other.raw.length ? base.raw : other.raw,
    });
  }

  return Array.from(byId.values());
};

/** 검색·장소 매칭용 별칭. 문서가 같은 곳을 여러 이름으로 부른다. */
const aliases: Record<string, string[]> = {
  bolzano: ['볼차노', 'Bolzano', 'Bozen', 'BZO'],
  seceda: ['세체다', 'Seceda'],
  'alpe-di-siusi': ['알페 디 시우시', 'Alpe di Siusi', 'Seiser Alm'],
  'tre-cime': ['트레 치메', 'Tre Cime', '트레치메', 'Auronzo'],
  amsterdam: ['암스테르담', 'Amsterdam', 'AMS'],
  munich: ['뮌헨', 'München', 'Munich', 'MUC'],
  venice: ['베네치아', 'Venezia', 'Venice', 'VCE', '메스트레', 'Mestre'],
  seoul: ['인천', 'ICN', '서울'],
};

export const HAPPY_WEEK_SNAPSHOT: HappyWeekSnapshot = {
  meta: {
    builtAt: '2026-09-05',
    tripStart: '2026-09-05',
    tripEnd: '2026-09-18',
    tzOffsetMin: 120,
    travelers: [
      { en: 'KIM HYEONGYU', ko: '현규' },
      { en: 'KIM HEESUNG', ko: '희성' },
    ],
    warning: '요금·영업시간은 이 날짜 기준이다. 현장에서 다르면 현장이 맞다.',
    sourceHeadSha: HAPPY_WEEK_SOURCE_HEAD_SHA,
    sourceShas: HAPPY_WEEK_SOURCE_SHAS,
  },
  days: happyWeekDaysSeed,
  items: mergeItems([...happyWeekAnchorItemsSeed, ...happyWeekDolomitiItemsSeed, ...happyWeekCityItemsSeed]),
  deadlines: happyWeekDeadlinesSeed,
  gaps: happyWeekGapsSeed,
  contacts: happyWeekContactsSeed,
  standby: happyWeekStandbySeed,
  browse: happyWeekBrowseSeed,
  decisions: happyWeekDecisionsSeed,
  aliases,
};
