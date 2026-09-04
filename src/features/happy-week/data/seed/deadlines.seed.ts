import { HappyWeekDeadline } from '@/features/happy-week/types';

/**
 * 마감 있는 것.
 *
 * 소스: `trip/bookings.md` "🚨 마감 있는 것" 표 · `trip/00-overview.md` "아직 안 정해진 것" ·
 * `trip/messages.md` "❗ 남은 것" · `trip/open-questions.md` 🔴 항목
 * (`trip/cities/dolomiti.md`·`trip/cities/munich.md`에서 상세 보강).
 *
 * dueUtc는 UTC다. 문서의 시각은 전부 CEST(UTC+2)이므로 2시간을 뺐다. 원문 표기는 dueRaw에 남긴다.
 */
export const happyWeekDeadlinesSeed: HappyWeekDeadline[] = [
  {
    id: 'dl.neuschwanstein-ticket',
    // 09-08 23:59 CEST. 문서에는 "09-08까지"만 있고 시각 표기가 없어 하루 끝으로 해석했다.
    dueUtc: '2026-09-08T21:59:00Z',
    dueRaw: '09-08까지 (09-10 방문 시) / 09-09까지 (09-11 방문 시) — 방문 2일 전 마감',
    title: '노이슈반슈타인 성 내부 투어 온라인 예약',
    whatBreaks:
      '내부는 시간지정 가이드 투어만 가능하고 공식 온라인 예약이 방문 2일 전 마감이다. 놓치면 성 내부를 못 본다. 현장 당일권은 티켓센터 08:00 오픈 전부터 줄을 서야 해서 07:00 렌터카 픽업(09:10 도착) 일정으로는 늦다. 실패해도 마리엔 다리 + 외관 + 알프제(무료·예약 불필요)만으로 하루는 성립한다.',
    constraint:
      '9월 성수기라 매진 위험이 크다. Q20(노이슈반슈타인을 넣을지)·Q39(렌터카를 09-10/09-11 중 어느 날 쓸지)가 정해지는 즉시 예약해야 한다. 문서에 마감 시·분 표기는 없다 — "방문 2일 전"만 적혀 있어 그날 끝으로 잡았다.',
    costText: null,
    owner: '현규',
    registerUrl: null,
    registerPath: null,
    anchorAfterItemId: null,
    status: 'open',
  },
  {
    id: 'dl.munich-car-cancel',
    // 09-09 CEST. 문서에 날짜만 있고 시각이 없어 하루 끝(23:59)으로 해석했다.
    dueUtc: '2026-09-09T21:59:00Z',
    dueRaw: '09-09',
    title: '뮌헨 당일 렌터카 09-10 / 09-11 중 1건 취소',
    whatBreaks:
      '무료 취소 기한을 넘기면 쓰지도 않을 하루치 요금이 그대로 나간다 — 09-10분 106,600원 또는 09-11분 131,777원(둘 다 현규 결제)이 소멸한다. 09-04 기준 상태는 ❌ 미결정.',
    constraint:
      '두 건 모두 Sixt Laim역 24시간 지점(Wotanstr. 9) 07:00 인수 ~ 23:30 반납이라 일정상으로는 어느 날이든 가능하다(09-10에 노이슈반슈타인을 다녀와도 21:00 UCL 킥오프까지 여유 3시간 이상). 남은 판단 기준은 날씨뿐 — 차가 오픈카(VW T-Roc 카브리올레)라 09-09에 두 날 예보를 비교해 맑은 날을 남긴다. 예약처는 트립닷컴(공급사 Sixt).',
    costText: '09-10 106,600원 / 09-11 131,777원 (둘 다 현규 결제)',
    owner: '현규',
    registerUrl: null,
    registerPath: null,
    anchorAfterItemId: null,
    status: 'open',
  },
  {
    id: 'dl.neuschwanstein-decision',
    // 09-09 15:46 CEST 뮌헨 Hbf 도착(ICE 225) = 문서의 "뮌헨 도착 전".
    dueUtc: '2026-09-09T13:46:00Z',
    dueRaw: '뮌헨 도착 전 (09-09 15:46 ICE 225 도착)',
    title: '노이슈반슈타인 성 당일치기를 넣을지 결정',
    whatBreaks:
      '이게 안 정해지면 09-10/09-11 중 어느 렌터카를 취소할지도, 내부 투어 티켓을 언제 예약할지도 정할 수 없다. 왕복 약 120km(편도 1시간 40~45분)로 하루를 통째로 쓰는 일정이라 뮌헨 3박의 배분 자체가 걸려 있다.',
    constraint:
      '00-overview의 기한 표기는 "뮌헨 도착 전"이지만 실제로는 더 이르다 — 티켓 온라인 예약 마감(09-08)과 렌터카 무료 취소 기한(09-09)에 묶여 있어 09-08 전에 결론이 나야 한다. 09-10·09-11 둘 다 가능함은 2026-09-04에 검토 완료.',
    costText: null,
    owner: '현규',
    registerUrl: null,
    registerPath: null,
    anchorAfterItemId: null,
    status: 'open',
  },
  {
    id: 'dl.dolomiti-car-cancel',
    // 09-12 13:00 CEST = 픽업 시각과 동일.
    dueUtc: '2026-09-12T11:00:00Z',
    dueRaw: '09-12 13:00',
    title: '돌로미티 렌터카(Avis) 무료 취소 기한',
    whatBreaks:
      '취소 계획이 없으므로 지금은 아무것도 깨지지 않는다. 다만 이 시각을 넘기면 선결제 321,217원은 되돌릴 수 없다 — 09-12 이전에 일정이 뒤집히는 경우에만 의미가 있는 경계다.',
    constraint:
      '무료 취소 기한이 픽업 시각(09-12 13:00, 볼차노 공항 지점)과 같아 사실상 픽업 직전까지 취소할 수 있다. 취소 계획 없음이므로 액션이 아니다.',
    costText: '321,217원 선결제 (희성) · 보증금 €200 별도(현장 결제 예상)',
    owner: '희성',
    registerUrl: null,
    registerPath: null,
    anchorAfterItemId: null,
    status: 'informational',
  },
  {
    id: 'dl.trecime-plate',
    // 09-14 23:59 CEST.
    dueUtc: '2026-09-14T21:59:00Z',
    dueRaw: '09-14 (월) 23:59',
    title: '트레 치메 유료도로 예약에 렌터카 번호판 등록',
    whatBreaks:
      '톨게이트가 자동 게이트라 예약된 번호판과 일치하지 않으면 입장이 거부된다. 09-15 08:30 슬롯(€40, 희성 결제)이 그대로 날아가고, 트레 치메 디 라바레도 루프 + 카디니 디 미주리나 + 엔로사디라 일몰로 짜인 09-15 하루가 통째로 붕괴한다.',
    constraint:
      '수정은 딱 1회만 가능하다. 번호판은 09-12 13:00 볼차노 공항 Avis 픽업 전에는 알 수 없으므로 픽업 직후 바로 입력한다. 슬롯 유효 시간은 예약 시각부터 12시간(08:30 → 20:30)이고, 초과해도 갇히지는 않으며 요금이 자동으로 2배(€80) 청구된다.',
    costText: '€40 (희성 결제) — 미등록 시 소멸',
    owner: '둘 다',
    registerUrl: 'https://pass.auronzo.info',
    registerPath: '포털 로그인 → "Tickets – My Tickets" 에서 번호판 입력',
    anchorAfterItemId: 'carPickup.avis-bolzano',
    status: 'open',
  },
];
