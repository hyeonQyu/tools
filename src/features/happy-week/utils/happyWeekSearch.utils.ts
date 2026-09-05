import {
  HappyWeekBrowseItem,
  HappyWeekContact,
  HappyWeekDeadline,
  HappyWeekDecision,
  HappyWeekGap,
  HappyWeekItem,
  HappyWeekSnapshot,
  HappyWeekStandby,
} from '@/features/happy-week/types';
import { checkChosungOnly, getChosung, normalizeSearchText } from '@/lib';

export type HappyWeekSearchKind = 'item' | 'deadline' | 'contact' | 'standby' | 'browse' | 'gap' | 'decision';

export type HappyWeekSearchEntry =
  | { kind: 'item'; id: string; title: string; subtitle: string; dateKey: string; haystack: string[]; payload: HappyWeekItem }
  | { kind: 'deadline'; id: string; title: string; subtitle: string; dateKey: string; haystack: string[]; payload: HappyWeekDeadline }
  | { kind: 'contact'; id: string; title: string; subtitle: string; dateKey: null; haystack: string[]; payload: HappyWeekContact }
  | { kind: 'standby'; id: string; title: string; subtitle: string; dateKey: null; haystack: string[]; payload: HappyWeekStandby }
  | { kind: 'browse'; id: string; title: string; subtitle: string; dateKey: null; haystack: string[]; payload: HappyWeekBrowseItem }
  | { kind: 'gap'; id: string; title: string; subtitle: string; dateKey: string | null; haystack: string[]; payload: HappyWeekGap }
  | { kind: 'decision'; id: string; title: string; subtitle: string; dateKey: null; haystack: string[]; payload: HappyWeekDecision };

export const SEARCH_KIND_LABEL: Record<HappyWeekSearchKind, string> = {
  item: '일정',
  deadline: '마감',
  contact: '연락처',
  standby: '절차',
  browse: '장소 · 먹거리',
  gap: '미확인',
  decision: '과거 결정',
};

/** 결과 그룹 순서. 급한 순간에 찾는 것이 앞에 온다. */
export const SEARCH_KIND_ORDER: HappyWeekSearchKind[] = ['item', 'deadline', 'contact', 'standby', 'browse', 'gap', 'decision'];

const expandAliases = (aliases: Record<string, string[]>, text: string) => {
  const extra: string[] = [];
  for (const variants of Object.values(aliases)) {
    if (variants.some((variant) => text.includes(variant))) extra.push(...variants);
  }
  return extra;
};

/** 빌드타임에 한 번 만든다. 스냅샷이 상수라 메모이즈할 필요가 없다. */
export const buildHappyWeekSearchIndex = (snapshot: HappyWeekSnapshot): HappyWeekSearchEntry[] => {
  const entries: HappyWeekSearchEntry[] = [];
  const withAliases = (parts: (string | null | undefined)[]) => {
    const base = parts.filter((part): part is string => Boolean(part));
    return [...base, ...expandAliases(snapshot.aliases, base.join(' '))];
  };

  for (const item of snapshot.items) {
    entries.push({
      kind: 'item',
      id: item.id,
      title: item.title,
      subtitle: `${item.dateKey.slice(5)} · ${item.timeRaw}`,
      dateKey: item.dateKey,
      haystack: withAliases([
        item.title,
        item.headline,
        item.place?.name,
        item.place?.address,
        ...item.facts.map((fact) => `${fact.label} ${fact.value}`),
        ...item.notes,
        item.raw,
      ]),
      payload: item,
    });
  }

  for (const deadline of snapshot.deadlines) {
    entries.push({
      kind: 'deadline',
      id: deadline.id,
      title: deadline.title,
      subtitle: deadline.dueRaw,
      dateKey: deadline.dueUtc.slice(0, 10),
      haystack: withAliases([deadline.title, deadline.whatBreaks, deadline.constraint, deadline.registerUrl, deadline.dueRaw]),
      payload: deadline,
    });
  }

  for (const contact of snapshot.contacts) {
    entries.push({
      kind: 'contact',
      id: contact.id,
      title: contact.name,
      subtitle: contact.tel ?? '번호 없음',
      dateKey: null,
      haystack: withAliases([contact.name, contact.tel, contact.context, contact.missingNote]),
      payload: contact,
    });
  }

  for (const standby of snapshot.standby) {
    entries.push({
      kind: 'standby',
      id: standby.id,
      title: standby.title,
      subtitle: `${standby.activeFrom.slice(5)} ~ ${standby.activeTo.slice(5)}`,
      dateKey: null,
      haystack: withAliases([
        standby.title,
        standby.dangerBanner,
        ...(standby.steps?.map((step) => step.text) ?? []),
        ...(standby.table?.rows.flat() ?? []),
        standby.phrase?.native,
        standby.phrase?.en,
      ]),
      payload: standby,
    });
  }

  for (const browse of snapshot.browse) {
    entries.push({
      kind: 'browse',
      id: browse.id,
      title: browse.name,
      subtitle: browse.city,
      dateKey: null,
      haystack: withAliases([browse.name, browse.nameLocal, browse.desc, browse.note, browse.city]),
      payload: browse,
    });
  }

  for (const gap of snapshot.gaps) {
    entries.push({
      kind: 'gap',
      id: gap.id,
      title: gap.subject,
      subtitle: gap.neededAtRaw ?? gap.kind,
      dateKey: gap.neededOnDate,
      haystack: withAliases([gap.subject, gap.detail, gap.resolveHint, gap.questionId]),
      payload: gap,
    });
  }

  snapshot.decisions.forEach((decision, index) => {
    entries.push({
      kind: 'decision',
      id: `decision-${index}`,
      title: decision.title,
      subtitle: decision.date,
      dateKey: null,
      haystack: withAliases([decision.title, decision.body, decision.ref]),
      payload: decision,
    });
  });

  return entries;
};

/** SelectPage와 같은 래더: 부분 일치 → 초성 일치. */
export const matchesHappyWeekQuery = (entry: HappyWeekSearchEntry, query: string) => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return false;

  const targets = entry.haystack.map(normalizeSearchText);
  if (targets.some((target) => target.includes(normalizedQuery))) return true;

  return checkChosungOnly(normalizedQuery) && targets.some((target) => getChosung(target).includes(normalizedQuery));
};

export const searchHappyWeek = (index: HappyWeekSearchEntry[], query: string, limitPerKind = 8) => {
  const matched = index.filter((entry) => matchesHappyWeekQuery(entry, query));

  return SEARCH_KIND_ORDER.map((kind) => {
    const inKind = matched.filter((entry) => entry.kind === kind);
    return { kind, total: inKind.length, entries: inKind.slice(0, limitPerKind) };
  }).filter((group) => group.total > 0);
};
