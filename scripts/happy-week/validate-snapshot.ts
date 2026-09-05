/**
 * 스냅샷 무결성 검증.
 *
 *   yarn happy-week:validate
 *
 * Zod 스키마만으로는 못 잡는 세 가지를 본다:
 *   1. 파일 간 ID 참조가 실제로 존재하는가 (dangling)
 *   2. startUtc를 CEST로 되돌렸을 때 dateKey와 맞는가 (시각 변환 오류)
 *   3. severity가 hard인데 headline이 없는가 (설계상 "접힌 카드가 곧 답"이라는 전제가 깨진다)
 *
 * 이 도구는 오프라인이 전제라 현장에서 고칠 수 없다. 빌드 전에 전부 잡아야 한다.
 */

import { HAPPY_WEEK_SNAPSHOT } from '../../src/features/happy-week/data/snapshot';
import { happyWeekSnapshotSchema } from '../../src/features/happy-week/types/happyWeek.types';

const CEST_OFFSET_MS = 2 * 60 * 60 * 1000;

const pad2 = (value: number) => String(value).padStart(2, '0');

const toCestDateKey = (iso: string) => {
  const cest = new Date(new Date(iso).getTime() + CEST_OFFSET_MS);
  return `${cest.getUTCFullYear()}-${pad2(cest.getUTCMonth() + 1)}-${pad2(cest.getUTCDate())}`;
};

const errors: string[] = [];
const warnings: string[] = [];

/* ─── 1. Zod ────────────────────────────────────────────── */

const parsed = happyWeekSnapshotSchema.safeParse(HAPPY_WEEK_SNAPSHOT);

if (!parsed.success) {
  for (const issue of parsed.error.issues) {
    errors.push(`[스키마] ${issue.path.join('.')}: ${issue.message}`);
  }
}

const snapshot = HAPPY_WEEK_SNAPSHOT;

/* ─── 2. ID 중복과 dangling 참조 ────────────────────────── */

const collect = (label: string, ids: string[]) => {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) errors.push(`[중복 ID] ${label}: ${id}`);
    seen.add(id);
  }
  return seen;
};

const itemIds = collect('items', snapshot.items.map((item) => item.id));
const deadlineIds = collect('deadlines', snapshot.deadlines.map((deadline) => deadline.id));
const contactIds = collect('contacts', snapshot.contacts.map((contact) => contact.id));
const standbyIds = collect('standby', snapshot.standby.map((standby) => standby.id));
collect('gaps', snapshot.gaps.map((gap) => gap.id));
collect('browse', snapshot.browse.map((browseItem) => browseItem.id));

const checkRefs = (from: string, refs: string[], pool: Set<string>, poolName: string) => {
  for (const ref of refs) {
    if (!pool.has(ref)) errors.push(`[dangling] ${from} → ${poolName}.${ref} 가 존재하지 않는다`);
  }
};

for (const item of snapshot.items) {
  checkRefs(item.id, item.linkedItemIds, itemIds, 'items');
  checkRefs(item.id, item.deadlineIds, deadlineIds, 'deadlines');
  checkRefs(item.id, item.contactIds, contactIds, 'contacts');
  checkRefs(item.id, item.procedureIds, standbyIds, 'standby');
}

for (const deadline of snapshot.deadlines) {
  if (deadline.anchorAfterItemId) {
    checkRefs(deadline.id, [deadline.anchorAfterItemId], itemIds, 'items');
  }
}

/* ─── 3. 시각 변환 ──────────────────────────────────────── */

for (const item of snapshot.items) {
  if (!item.startUtc) continue;

  // KST/CST 항목은 현지 날짜 기준이 다르므로 CEST 대조에서 제외한다.
  if (item.tz !== 'CEST') continue;

  const derived = toCestDateKey(item.startUtc);
  if (derived !== item.dateKey) {
    errors.push(`[시각] ${item.id}: startUtc(${item.startUtc})를 CEST로 되돌리면 ${derived}인데 dateKey는 ${item.dateKey}다`);
  }

  if (item.endUtc && new Date(item.endUtc).getTime() < new Date(item.startUtc).getTime()) {
    errors.push(`[시각] ${item.id}: endUtc가 startUtc보다 이르다`);
  }
}

/* ─── 4. 날짜가 여행 기간 안에 있는가 ───────────────────── */

const dayKeys = new Set(snapshot.days.map((day) => day.dateKey));

for (const item of snapshot.items) {
  if (!dayKeys.has(item.dateKey)) errors.push(`[날짜] ${item.id}: dateKey ${item.dateKey} 가 여행 14일에 없다`);
}

for (const gap of snapshot.gaps) {
  if (gap.neededOnDate && !dayKeys.has(gap.neededOnDate)) {
    errors.push(`[날짜] ${gap.id}: neededOnDate ${gap.neededOnDate} 가 여행 14일에 없다`);
  }
}

/* ─── 5. hard인데 headline이 없는 것 ────────────────────── */

for (const item of snapshot.items) {
  if (item.severity === 'hard' && !item.headline) {
    warnings.push(`[headline] ${item.id} (${item.title}) 는 hard인데 headline이 없다`);
  }
}

/* ─── 6. 번호 없는 연락처에 확보 방법이 있는가 ──────────── */

for (const contact of snapshot.contacts) {
  if (!contact.tel && !contact.missingNote) {
    errors.push(`[연락처] ${contact.id}: 번호가 없는데 확보 방법(missingNote)도 없다`);
  }
}

/* ─── 결과 ──────────────────────────────────────────────── */

const counts = {
  days: snapshot.days.length,
  items: snapshot.items.length,
  deadlines: snapshot.deadlines.length,
  gaps: snapshot.gaps.length,
  contacts: snapshot.contacts.length,
  standby: snapshot.standby.length,
  browse: snapshot.browse.length,
  decisions: snapshot.decisions.length,
};

console.log('스냅샷 레코드 수:', JSON.stringify(counts));
console.log(`총 ${Object.values(counts).reduce((sum, n) => sum + n, 0)}건`);

if (warnings.length > 0) {
  console.log(`\n경고 ${warnings.length}건:`);
  for (const warning of warnings) console.log('  ' + warning);
}

if (errors.length > 0) {
  console.error(`\n오류 ${errors.length}건:`);
  for (const error of errors) console.error('  ' + error);
  process.exit(1);
}

console.log('\n무결성 검증 통과');
