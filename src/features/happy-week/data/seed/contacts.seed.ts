import { HappyWeekContact } from '@/features/happy-week/types';

/**
 * 출처: trip/emergency.md (표 4개 전부), trip/bookings.md, trip/04-stays.md
 *
 * 실제 번호가 있는 것 9건, 번호가 없는 것 10건. 없는 쪽이 더 많은 것이 원문 그대로의 상태이며,
 * 감추지 않고 tel=null + missingNote(확보 방법)로 노출한다.
 * tel === null 인 10건은 전부 fillable: true — 현장에서 앱에 직접 적어 넣는다.
 */
export const happyWeekContactsSeed: HappyWeekContact[] = [
  /* ─── emergency: 유럽 공통 및 국가별 긴급번호 ─────────────── */
  {
    id: 'ct.eu-emergency',
    group: 'emergency',
    name: '긴급전화 (경찰·구급·소방) — EU 공통',
    tel: '112',
    telHref: '112',
    context: 'EU 전역 공통 긴급번호. 인명 피해가 있으면 다른 어떤 연락보다 먼저 112. 사고 발생 시 1순위: 안전 확보 → 즉시 112.',
    missingNote: null,
    fillable: false,
    scope: { dateKeys: [], country: 'ALL' },
  },
  {
    id: 'ct.italy-police',
    group: 'emergency',
    name: '이탈리아 경찰',
    tel: '113',
    telHref: '113',
    context: '이탈리아 국가경찰 직통. 돌로미티(09-12~09-16)·베네치아(09-16~09-17) 구간. 여권 분실 시 분실 확인서 발급처.',
    missingNote: null,
    fillable: false,
    scope: { dateKeys: [], country: 'IT' },
  },
  {
    id: 'ct.italy-ambulance',
    group: 'emergency',
    name: '이탈리아 구급',
    tel: '118',
    telHref: '118',
    context: '이탈리아 구급 직통. 산악 구간(세체다·라가주오이·트레 치메) 사고 시. 112로도 연결된다.',
    missingNote: null,
    fillable: false,
    scope: { dateKeys: [], country: 'IT' },
  },
  {
    id: 'ct.germany-police',
    group: 'emergency',
    name: '독일 경찰',
    tel: '110',
    telHref: '110',
    context: '독일 경찰 직통. 뮌헨 체류(09-09~09-12) 및 09-10/09-11 렌터카 운행 구간.',
    missingNote: null,
    fillable: false,
    scope: { dateKeys: [], country: 'DE' },
  },

  /* ─── consulate: 영사콜센터 + 공관 3곳 ─────────────────────── */
  {
    id: 'ct.consulate-call-center',
    group: 'consulate',
    name: '영사콜센터 (24시간, 서울)',
    tel: '+82-2-3210-0404',
    telHref: '+82232100404',
    context:
      '24시간 운영. 공관 대표번호를 아직 못 적었다면 여기로 먼저 연결한다. 여권 분실 시 절차: 현지 경찰 신고서(분실 확인서) → 공관에서 여행증명서 발급.',
    missingNote: null,
    fillable: false,
    scope: { dateKeys: [], country: 'ALL' },
  },
  {
    id: 'ct.consulate-netherlands',
    group: 'consulate',
    name: '주네덜란드 대한민국 대사관 (헤이그)',
    tel: null,
    telHref: null,
    context:
      '암스테르담·헤이그 관할. 여권 분실 시. 원문: "네덜란드 (암스테르담·헤이그) | 주네덜란드 대한민국 대사관 (헤이그) | 여권 분실 시"',
    missingNote:
      '문서에 번호가 없다. 원문 표 제목이 [확인필요 — 출발 전 최신 번호 확인]이다. 출발 전 외교부 해외안전여행 공관 안내에서 대표번호를 확인해 여기 적을 것. 확보 전에는 영사콜센터 +82-2-3210-0404로 먼저 연결한다.',
    fillable: true,
    scope: { dateKeys: [], country: 'NL' },
  },
  {
    id: 'ct.consulate-munich',
    group: 'consulate',
    name: '주독일 대한민국 대사관 본분관 (뮌헨)',
    tel: null,
    telHref: null,
    context:
      '뮌헨에 분관이 있어 로마·헤이그보다 접근이 빠르다. 원문: "독일 (뮌헨) | 주독일 대한민국 대사관 본분관 (뮌헨) | 뮌헨에 분관 있음"',
    missingNote:
      '문서에 번호가 없다. 원문 표 제목이 [확인필요 — 출발 전 최신 번호 확인]이다. 출발 전 외교부 해외안전여행 공관 안내에서 뮌헨 분관 대표번호를 확인해 여기 적을 것. 확보 전에는 영사콜센터 +82-2-3210-0404.',
    fillable: true,
    scope: { dateKeys: [], country: 'DE' },
  },
  {
    id: 'ct.consulate-rome',
    group: 'consulate',
    name: '주이탈리아 대한민국 대사관 (로마)',
    tel: null,
    telHref: null,
    context:
      '돌로미티·베네치아 관할. 원문: "이탈리아 (돌로미티·베네치아) | 주이탈리아 대한민국 대사관 (로마) | 베네치아는 관할 확인" — 베네치아 관할이 로마인지 자체가 미확인 상태다.',
    missingNote:
      '문서에 번호가 없다. 원문 표 제목이 [확인필요 — 출발 전 최신 번호 확인]이다. 출발 전 외교부 해외안전여행 공관 안내에서 대표번호를 확인하고, 동시에 베네치아 관할 공관(로마 대사관 / 밀라노 총영사관 여부)도 함께 확인해 적을 것. 확보 전에는 영사콜센터 +82-2-3210-0404.',
    fillable: true,
    scope: { dateKeys: [], country: 'IT' },
  },

  /* ─── vendor: 렌터카·택시·짐보관·산장·항공사·숙소 ─────────── */
  {
    id: 'ct.avis-roadside',
    group: 'vendor',
    name: 'Avis 긴급출동 (돌로미티 렌터카)',
    tel: null,
    telHref: null,
    context:
      '본 대여: 오펠 코르사, 09-12 13:00 ~ 09-16 13:00, 볼차노 공항 지점 인수·반납 동일. 자차(CDW) 슈페리어 보장 포함, 보증금 €200 현장 결제 예상. 렌터카 사고 시 2순위 연락처(1순위는 112) — 사진 촬영, 상대방 정보 교환 병행.',
    missingNote:
      '문서에 번호가 없다. 원문 지시: "픽업 시 계약서에서 확인해 여기 적을 것". 09-12 13:00 볼차노 공항 지점 픽업 때 Avis 계약서에서 긴급출동 번호를 옮겨 적을 것.',
    fillable: true,
    scope: { dateKeys: ['2026-09-12', '2026-09-13', '2026-09-14', '2026-09-15', '2026-09-16'], country: 'IT' },
  },
  {
    id: 'ct.sixt-main',
    group: 'vendor',
    name: 'Sixt 대표번호 (뮌헨 당일 렌터카)',
    tel: '+49 89 666 060 60',
    telHref: '+498966606060',
    context:
      'Sixt 대표번호 — Laim 지점 안내에 표기된 번호이지 지점 직통이 아니다. 지점: Munich Laim Train Station 24h, Wotanstr. 9, 80639 München · 24시간 영업. 차량 VW T-Roc 카브리올레(또는 동급), 07:00 인수 ~ 23:30 반납. 예약처는 트립닷컴, 공급사가 Sixt다.',
    missingNote: null,
    fillable: false,
    scope: { dateKeys: ['2026-09-10', '2026-09-11'], country: 'DE' },
  },
  {
    id: 'ct.sixt-branch',
    group: 'vendor',
    name: 'Sixt Laim 지점 직통 · 긴급출동',
    tel: null,
    telHref: null,
    context:
      '원문 Sixt 행은 대표번호와 "지점 직통·긴급출동 번호 [확인필요]" 두 항목이 <br>로 붙어 있다. 이쪽이 없는 절반이다. 뮌헨 2건(09-10 / 09-11) 중 1건은 09-09까지 취소 예정이라 아직 어느 날인지 미정 — 두 날 모두 후보다.',
    missingNote:
      '문서에 번호가 없다. 07:00 인수 시 Sixt 계약서·차량 서류에서 지점 직통 및 긴급출동 번호를 확인해 적을 것. 확보 전에는 대표번호 +49 89 666 060 60(24시간 지점)을 쓴다.',
    fillable: true,
    scope: { dateKeys: ['2026-09-10', '2026-09-11'], country: 'DE' },
  },
  {
    id: 'ct.taxi-munich',
    group: 'vendor',
    name: 'Taxi München eG (뮌헨 택시)',
    tel: '+49 89 21610',
    telHref: '+498921610',
    context: '뮌헨 콜택시. 앱은 FREENOW / Uber / Bolt. 상세 절차는 howto/taxi-munich.md. UCL 경기(09-10 21:00) 종료 후 심야 이동 대비.',
    missingNote: null,
    fillable: false,
    scope: { dateKeys: [], country: 'DE' },
  },
  {
    id: 'ct.base-camp-dolomites',
    group: 'vendor',
    name: 'Base Camp Dolomites (09-16 짐 보관)',
    tel: '+39 0471 971733',
    telHref: '+390471971733',
    context:
      '보젠(볼차노)역 바로 앞, Piazza Stazione 1. 매일 08:30~18:30. 09-16 14:00~15:15 이용 예정이며 예약이 아닌 현장 이용이다. 같은 날 15:31 EC85 탑승 전 시간이 빠듯하다.',
    missingNote: null,
    fillable: false,
    scope: { dateKeys: ['2026-09-16'], country: 'IT' },
  },
  {
    id: 'ct.rifugio-averau',
    group: 'vendor',
    name: 'Rifugio Averau (09-14 점심)',
    tel: '+39 0436 4660',
    telHref: '+3904364660',
    context: '09-14 점심 예정 산장. 원문 비고: "영업시간 확인용" — 예약이 아니라 당일 영업 여부를 확인하려고 적어 둔 번호다.',
    missingNote: null,
    fillable: false,
    scope: { dateKeys: ['2026-09-14'], country: 'IT' },
  },
  {
    id: 'ct.stays',
    group: 'vendor',
    name: '숙소 5곳 전화번호',
    tel: null,
    telHref: null,
    context:
      '① 암스테르담 베스트웨스턴 자안 인 호텔 (09-05~09-09, 예약처·주소도 미기록) ② 뮌헨 Fallmerayerstraße 22 에어비앤비 (09-09~09-12, 확인번호 HMSMR9PWKH, 스마트 도어록 — 코드가 안 오면 호스트에게 먼저 연락) ③ Gasthof Albergo Kreuzwirt, Kirchplatz 2, 39050 Völs am Schlern (09-12~09-14) ④ Hotel Weisses Lamm, 몽구엘포 (09-14~09-16) ⑤ 카 레베카 베네치아, Via Col di Lana 14, 30171 Venezia 메스트레 (09-16~09-17, 프런트 10:00~22:00로 24시간이 아님).',
    missingNote:
      '5곳 전부 전화번호가 문서에 없다. 원문 지시: "예약 확인서에서 전화번호 옮겨 적을 것". 뮌헨은 에어비앤비, 돌로미티 2곳·베네치아는 아고다 확인서에서 옮겨 적을 것. 암스테르담은 예약처 자체가 미기록이라 확인서를 어디서 받는지도 모르는 상태이므로 결제자인 희성에게 먼저 확인해야 하고, 주소까지 없어 09-05 18:40 도착 전에 반드시 확보해야 한다. 뮌헨은 도어록 코드가 09-07경까지 안 오면 호스트 연락 수단이 필요하다.',
    fillable: true,
    scope: { dateKeys: [], country: 'ALL' },
  },
  {
    id: 'ct.china-southern',
    group: 'vendor',
    name: '중국남방항공 (가는 편)',
    tel: null,
    telHref: null,
    context: 'CZ316 ICN(T1) 09:25 → PKX 10:30 / CZ345 PKX 14:15 → AMS 18:40. 환승 시 수하물 재수속 불필요, 경유 비자 불필요.',
    missingNote:
      '문서에 번호가 없고 [확인필요] 상태다. 국제선 왕복은 예약처·결제자·금액이 전부 미기록이라 예약처를 통한 문의도 막혀 있다. 출발 전 e-티켓 또는 중국남방항공 한국 예약센터 번호를 확인해 적을 것.',
    fillable: true,
    scope: { dateKeys: ['2026-09-05'], country: 'ALL' },
  },
  {
    id: 'ct.air-china',
    group: 'vendor',
    name: '중국국제항공 (오는 편)',
    tel: null,
    telHref: null,
    context: 'CA974 VCE 21:30 → PEK(T3) 09-18 13:30 / CA709 PEK(T3) 19:15 → ICN(T1) 22:00. 환승 시 수하물 재수속 불필요, 경유 비자 불필요.',
    missingNote:
      '문서에 번호가 없고 [확인필요] 상태다. 국제선 왕복은 예약처·결제자·금액이 전부 미기록이다. 출발 전 e-티켓 또는 중국국제항공 한국 예약센터 번호를 확인해 적을 것.',
    fillable: true,
    scope: { dateKeys: ['2026-09-17', '2026-09-18'], country: 'ALL' },
  },

  /* ─── insurance: 보험·카드 ─────────────────────────────────── */
  {
    id: 'ct.travel-insurance',
    group: 'insurance',
    name: '여행자보험 (희성 가입)',
    tel: null,
    telHref: null,
    context: '희성이 가입 [확정, 2026-09-04]. 사고 발생 시 3순위 연락 대상(1: 112 → 2: Avis 긴급출동 → 3: 보험사). 증권은 희성이 보유.',
    missingNote:
      '보험사명·증권번호·24시간 긴급 연락처가 전부 [확인필요]다. 희성에게 증권 사진 또는 앱 화면을 받아 세 값을 여기 적을 것. 출발 전에 끝내야 사고 순간에 찾지 않는다.',
    fillable: true,
    scope: { dateKeys: [], country: 'ALL' },
  },
  {
    id: 'ct.card-loss',
    group: 'insurance',
    name: '카드 분실신고 (해외)',
    tel: null,
    telHref: null,
    context:
      '현규·희성 각자 사용 카드사의 해외 분실신고 번호. 렌터카 보증금 €200(또는 €200+대여요금) 현장 결제가 있어 카드 한도 여유도 함께 확보해 둘 것.',
    missingNote:
      '원문 지시: "각자 사용 카드사 해외 분실신고 번호 저장해 둘 것 [확인필요]". 현규·희성이 각자 카드사 앱/카드 뒷면에서 해외 분실신고 번호를 확인해 여기 적을 것.',
    fillable: true,
    scope: { dateKeys: [], country: 'ALL' },
  },
];
