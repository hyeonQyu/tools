import { z } from 'zod';

/* ─── 공통 원자 ───────────────────────────────────────── */

/** happy-week 저장소 CLAUDE.md의 상태 표시 규칙 4종 + 문서 실태에서 나온 2종 */
export const happyWeekConfidenceSchema = z.enum([
  'confirmed', // [확정] 예약 완료 / 되돌릴 수 없음
  'likely', // [유력] 사실상 정해졌지만 예약 전
  'undecided', // [미정] 아직 결정 안 함
  'unverified', // [확인필요]
  'missing', // 문서에 값이 아예 없음
  'conflicting', // 자료 상충 (두 값 병기)
]);

export type HappyWeekConfidence = z.infer<typeof happyWeekConfidenceSchema>;

/** 문서 시각은 전부 현지(CEST). ICN 출발/도착만 KST, 베이징 환승만 CST */
export const happyWeekTzSchema = z.enum(['CEST', 'KST', 'CST']);

export type HappyWeekTz = z.infer<typeof happyWeekTzSchema>;

export const happyWeekDateKeySchema = z.string().regex(/^2026-09-\d{2}$/);
export const happyWeekIsoSchema = z.string().regex(/^2026-09-\d{2}T\d{2}:\d{2}:\d{2}Z$/);

export const happyWeekCountrySchema = z.enum(['NL', 'DE', 'IT', 'AIR']);
export const happyWeekCitySchema = z.enum(['암스테르담', '뮌헨', '돌로미티', '베네치아']);

export type HappyWeekCity = z.infer<typeof happyWeekCitySchema>;

/* ─── Fact: 라벨/값 한 쌍. 상세 시트의 필드 ─────────────── */

export const happyWeekFactSchema = z.object({
  label: z.string(),
  /** 원문 그대로 유지한다. 정렬·재조합하지 않는다. */
  value: z.string(),
  /** confidence가 conflicting일 때의 두 번째 값 */
  altValue: z.string().optional(),
  display: z.enum(['text', 'mono', 'tel', 'address', 'url', 'money']),
  confidence: happyWeekConfidenceSchema,
  /** missing/unverified일 때 '어떻게 확보하나'. 빈칸으로 두면 사용자가 앱을 계속 뒤진다. */
  missingNote: z.string().optional(),
});

export type HappyWeekFact = z.infer<typeof happyWeekFactSchema>;

/* ─── Item: 레일에 놓이는 모든 것의 단일 형태 ───────────── */

export const happyWeekItemKindSchema = z.enum([
  'flight',
  'train',
  'bus',
  'drive',
  'lift',
  'ticket',
  'parking',
  'tollSlot',
  'checkin',
  'checkout',
  'carPickup',
  'carReturn',
  'luggage',
  'match',
  'meal',
  'sunset',
  'deadline',
  'gap',
  'free',
  'note',
]);

export type HappyWeekItemKind = z.infer<typeof happyWeekItemKindSchema>;

export const happyWeekItemSchema = z.object({
  id: z.string(),
  dateKey: happyWeekDateKeySchema,
  kind: happyWeekItemKindSchema,
  /** 이모지는 장식이 아니라 값이다. 원문 문서의 표기를 따른다. */
  icon: z.string().nullable(),

  /** null = 시각 없음(그날 종일) */
  startUtc: happyWeekIsoSchema.nullable(),
  endUtc: happyWeekIsoSchema.nullable(),
  tz: happyWeekTzSchema,
  /** '07:35~08:15' '오전' '~18:00' 등 원문 표기 */
  timeRaw: z.string(),
  /** 분 단위 정렬 키. 비수치 표현('오전')은 수동 매핑한다. */
  sortHint: z.number(),

  title: z.string(),
  /** 접힌 카드가 곧 답이 되게 하는 값. 자동 생성 불가 — 손 큐레이션. */
  headline: z.string().nullable(),
  severity: z.enum(['hard', 'warn', 'info']),

  /** '이보다 늦으면 망한다'. blockquote·decisions.md에만 있는 값을 1급으로 승격. */
  latestDepart: z
    .object({
      atUtc: happyWeekIsoSchema,
      label: z.string(),
    })
    .nullable(),

  /** 슬롯 유효창과 초과 시 결과. lost(소멸)와 penalty(추가 과금)를 반드시 구분한다. */
  window: z
    .object({
      validForMin: z.number(),
      overrun: z.enum(['lost', 'penalty', 'none']),
      overrunText: z.string(),
    })
    .nullable(),

  place: z
    .object({
      name: z.string(),
      address: z.string().nullable(),
      /** 좌표가 아니라 검색 쿼리형이라 오프라인에서 열리지 않는다. */
      mapQuery: z.string().nullable(),
      aliasKey: z.string().nullable(),
    })
    .nullable(),

  facts: z.array(happyWeekFactSchema),
  /** 표 밖 불릿 + ⚠️/🚨 blockquote에서 승격된 것 */
  notes: z.array(z.string()),
  flags: z.object({
    /** [검토안] — 확정 타임라인과 시각적으로 분리한다. */
    draft: z.boolean(),
    /** ~~취소선~~ — 제외 결정 */
    excluded: z.boolean(),
  }),

  linkedItemIds: z.array(z.string()),
  deadlineIds: z.array(z.string()),
  procedureIds: z.array(z.string()),
  contactIds: z.array(z.string()),

  /** 뮌헨 렌터카 09-10/09-11 미확정 대응 — 두 날 모두 '후보'로 렌더한다. */
  munichCarCandidate: z.boolean(),
  sourceDoc: z.string(),
  /** 파싱 실패 폴백용 원문 전체. 틀린 파싱보다 원문이 낫다. */
  raw: z.string(),
});

export type HappyWeekItem = z.infer<typeof happyWeekItemSchema>;

/* ─── Day: 시간축의 척추 (14개) ─────────────────────────── */

export const happyWeekDaySchema = z.object({
  dayNo: z.number().int().min(1).max(14),
  dateKey: happyWeekDateKeySchema,
  weekday: z.string(),
  stayCity: z.string().nullable(),
  stayId: z.string().nullable(),
  character: z.string(),
  riskLevel: z.enum(['normal', 'transfer', 'critical']),
  /** 계획이 '없다'와 데이터가 '없다'를 구분하는 1급 필드 */
  planDepth: z.enum(['detailed', 'candidates', 'none']),
  planDepthNote: z.string().nullable(),
  country: happyWeekCountrySchema,
  isDrivingDay: z.boolean(),
});

export type HappyWeekDay = z.infer<typeof happyWeekDaySchema>;

/* ─── Deadline ──────────────────────────────────────────── */

export const happyWeekDeadlineSchema = z.object({
  id: z.string(),
  dueUtc: happyWeekIsoSchema,
  dueRaw: z.string(),
  title: z.string(),
  whatBreaks: z.string(),
  constraint: z.string().nullable(),
  costText: z.string().nullable(),
  owner: z.enum(['현규', '희성', '둘 다', '둘 중 아는 사람']),
  registerUrl: z.string().nullable(),
  registerPath: z.string().nullable(),
  /** 이 앵커 이후에야 실행 가능 → 레일의 그 자리에 꽂힌다. */
  anchorAfterItemId: z.string().nullable(),
  /** '취소 계획 없음'처럼 액션이 아닌 것은 informational로 걸러낸다. */
  status: z.enum(['open', 'informational']),
});

export type HappyWeekDeadline = z.infer<typeof happyWeekDeadlineSchema>;

/* ─── Gap: 값이 없다는 사실 자체가 데이터 ───────────────── */

export const happyWeekGapSchema = z.object({
  id: z.string(),
  /** 'Q45'. 'Q14-잔여' 같은 변종이 있어 문자열이다. */
  questionId: z.string().nullable(),
  subject: z.string(),
  kind: z.enum(['missing', 'unverified', 'conflicting', 'undecided']),
  detail: z.string(),
  altDetail: z.string().nullable(),
  /** 이 날짜 레일에 kind:'gap' 아이템으로 물질화된다. */
  neededOnDate: happyWeekDateKeySchema.nullable(),
  neededAtRaw: z.string().nullable(),
  resolveHint: z.string(),
  /** 문서 등장 순서 = 작성자의 우선순위. Q번호로 정렬하지 않는다. */
  docOrder: z.number(),
});

export type HappyWeekGap = z.infer<typeof happyWeekGapSchema>;

/* ─── Contact ───────────────────────────────────────────── */

export const happyWeekContactSchema = z.object({
  id: z.string(),
  group: z.enum(['emergency', 'consulate', 'vendor', 'insurance']),
  name: z.string(),
  /** null = 번호 없음. 실제 번호(9건)보다 없는 번호(10건)가 많다. */
  tel: z.string().nullable(),
  /** '+'와 숫자만 */
  telHref: z.string().nullable(),
  context: z.string(),
  /** tel === null 이면 필수 */
  missingNote: z.string().nullable(),
  /** 여행 중 현장에서 채워 넣을 수 있는 필드인가 (Q1 결정: 로컬 메모 허용) */
  fillable: z.boolean(),
  scope: z.object({
    /** 빈 배열 = 상시 */
    dateKeys: z.array(happyWeekDateKeySchema),
    country: z.enum(['NL', 'DE', 'IT', 'ALL']),
  }),
});

export type HappyWeekContact = z.infer<typeof happyWeekContactSchema>;

/* ─── Standby: 그 날 유효한 howto / playbook 카드 ───────── */

export const happyWeekStandbyStepSchema = z.object({
  n: z.number(),
  text: z.string(),
  level: z.enum(['normal', 'warn', 'forbid']),
});

export const happyWeekStandbySchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string(),
  group: z.enum(['fuel', 'driving', 'taxi', 'entry', 'luggage', 'rental', 'delay', 'weather']),
  country: z.enum(['NL', 'DE', 'IT', 'ALL']),
  /** howto/README.md의 '해당 구간' 컬럼이 소스다. 발명이 아니라 인용. */
  activeFrom: happyWeekDateKeySchema,
  activeTo: happyWeekDateKeySchema,
  /** 해당 날짜에 표시되면 이미 늦는 항목을 앞당긴다 (예: 일요일 주유소 휴무). */
  offsetDays: z.number().int(),
  /** '🚨 N순위:' 접두에서 */
  priority: z.number().int(),
  kind: z.enum(['steps', 'table', 'phrase', 'addressCard', 'rules']),
  steps: z.array(happyWeekStandbyStepSchema).nullable(),
  table: z
    .object({
      headers: z.array(z.string()),
      rows: z.array(z.array(z.string())),
      /** 이모지 대신 실제 색 Box로 렌더할 컬럼 */
      swatchColumn: z.number().nullable(),
      swatches: z.array(z.string()).nullable(),
    })
    .nullable(),
  phrase: z
    .object({
      native: z.string(),
      pronunciation: z.string(),
      en: z.string().nullable(),
      placeholder: z.string().nullable(),
    })
    .nullable(),
  dangerBanner: z.string().nullable(),
});

export type HappyWeekStandby = z.infer<typeof happyWeekStandbySchema>;

/* ─── BrowseItem: 계획이 빈 날의 브라우즈 축 ────────────── */

export const happyWeekBrowseItemSchema = z.object({
  id: z.string(),
  city: happyWeekCitySchema,
  category: z.enum(['place', 'food', 'souvenir', 'rainyDay', 'excluded']),
  name: z.string(),
  nameLocal: z.string().nullable(),
  desc: z.string(),
  /** 접근 규정 / 타이밍 제약 */
  note: z.string().nullable(),
  rank: z.number().nullable(),
  weatherTag: z.enum(['indoor', 'outdoor', 'any']),
  confidence: happyWeekConfidenceSchema,
  excludedReason: z.string().nullable(),
  mapQuery: z.string().nullable(),
});

export type HappyWeekBrowseItem = z.infer<typeof happyWeekBrowseItemSchema>;

/* ─── Decision: archived. 검색 전용 ─────────────────────── */

export const happyWeekDecisionSchema = z.object({
  date: z.string(),
  title: z.string(),
  body: z.string(),
  tag: happyWeekConfidenceSchema,
  ref: z.string().nullable(),
});

export type HappyWeekDecision = z.infer<typeof happyWeekDecisionSchema>;

/* ─── LiveDocs: 새로고침으로 받은 최신 원문 ─────────────── */

export const happyWeekDocFileSchema = z.object({
  path: z.string(),
  sha: z.string(),
  content: z.string(),
});

export type HappyWeekDocFile = z.infer<typeof happyWeekDocFileSchema>;

/** callable getHappyWeekDocs 응답. 클라이언트가 보낸 SHA와 다른 문서만 files에 온다. */
export const happyWeekDocsResponseSchema = z.object({
  headSha: z.string(),
  fetchedAt: z.string(),
  files: z.array(happyWeekDocFileSchema),
  unchanged: z.array(z.string()),
});

export type HappyWeekDocsResponse = z.infer<typeof happyWeekDocsResponseSchema>;

/** localStorage에 누적 보관하는 최신 원문. path → 파일. */
export const happyWeekLiveDocsSchema = z.object({
  headSha: z.string(),
  fetchedAt: z.string(),
  files: z.record(z.string(), happyWeekDocFileSchema),
});

export type HappyWeekLiveDocs = z.infer<typeof happyWeekLiveDocsSchema>;

/* ─── 루트 스냅샷 ───────────────────────────────────────── */

export const happyWeekSnapshotSchema = z.object({
  meta: z.object({
    builtAt: z.string(),
    tripStart: happyWeekDateKeySchema,
    tripEnd: z.string(),
    /** CEST = UTC+2 고정. 여행 전 기간이 EU 서머타임 안이다. */
    tzOffsetMin: z.literal(120),
    travelers: z.array(z.object({ en: z.string(), ko: z.string() })),
    warning: z.string(),
    /** 스냅샷을 구울 때의 원본 저장소 HEAD. 새로고침 결과와 대조한다. */
    sourceHeadSha: z.string(),
    /** 문서 경로 → blob SHA. 어느 문서가 바뀌었는지 알기 위한 것. */
    sourceShas: z.record(z.string(), z.string()),
  }),
  days: z.array(happyWeekDaySchema).length(14),
  items: z.array(happyWeekItemSchema),
  deadlines: z.array(happyWeekDeadlineSchema),
  gaps: z.array(happyWeekGapSchema),
  contacts: z.array(happyWeekContactSchema),
  standby: z.array(happyWeekStandbySchema),
  browse: z.array(happyWeekBrowseItemSchema),
  decisions: z.array(happyWeekDecisionSchema),
  aliases: z.record(z.string(), z.array(z.string())),
});

export type HappyWeekSnapshot = z.infer<typeof happyWeekSnapshotSchema>;
