import { HappyWeekGap } from '@/features/happy-week/types';

/**
 * 소스: trip/open-questions.md (미해결 🔴/💰/🟡 항목만, `<details>` 안의 해결 완료 27건 제외)
 *       · trip/bookings.md (❗ 기록이 비어 있는 것 + 숙소 비고)
 *       · trip/emergency.md ([확인필요])
 *       · trip/prep/documents.md ([확인필요])
 *
 * docOrder는 Q번호가 아니라 **문서 등장 순서**다. open-questions.md의 미해결 목록은
 * 번호순이 아니며(Q39 → Q20 → Q49 → Q43) 그 순서 자체가 작성자의 우선순위다.
 */
export const happyWeekGapsSeed: HappyWeekGap[] = [
  /* ─── open-questions.md · 🔴 지금 결정해야 할 것 ───────────────────── */
  {
    id: 'gap.munich-car-day',
    questionId: 'Q39',
    subject: '뮌헨 당일 렌터카 09-10 / 09-11 중 어느 날을 쓸 것인가',
    kind: 'undecided',
    detail:
      '2건 다 예약돼 있고 무료 취소 기한은 09-09. 아직 [미정]. 일정 충돌 여부는 검토 완료(2026-09-04): 지점이 Sixt Laim역 24시간 지점이라 07:00 인수·23:30 반납 모두 가능하고, 09-10에 노이슈반슈타인을 다녀와도 21:00 직관까지 3시간 이상 여유가 있다. 남은 판단 기준은 날씨(오픈카) 뿐이다.',
    altDetail: null,
    neededOnDate: '2026-09-09',
    neededAtRaw: '09-09 (무료 취소 기한 — 이 날까지 1건 취소)',
    resolveHint:
      '09-08~09-09 뮌헨 주간예보(오픈카 기준)를 보고 하루를 골라 트립닷컴에서 나머지 1건 취소. cities/munich.md “09-10 렌터카 시나리오”, 03-driving.md, playbooks/weather-change.md 참고.',
    docOrder: 0,
  },
  {
    id: 'gap.neuschwanstein-daytrip',
    questionId: 'Q20',
    subject: '뮌헨 3박 중 노이슈반슈타인 성 당일치기를 넣을지',
    kind: 'undecided',
    detail: '왕복 이동만으로 하루 소요. 09-10·09-11 둘 다 가능함이 확인됨(2026-09-04). 넣을지는 여전히 [미정].',
    altDetail: null,
    neededOnDate: '2026-09-08',
    neededAtRaw: '09-08까지 (Q49 티켓 예약 마감 09-08에서 역산)',
    resolveHint: 'Q39(렌터카 날짜)와 함께 결정한다. 넣기로 하면 즉시 Q49 티켓 예약. cities/munich.md 참고.',
    docOrder: 1,
  },
  {
    id: 'gap.neuschwanstein-ticket',
    questionId: 'Q49',
    subject: '노이슈반슈타인 티켓 예약',
    kind: 'undecided',
    detail:
      '🔴 내부는 시간지정 가이드 투어만 가능하고 공식 온라인 예약이 방문 2일 전 마감이다(09-10 방문이면 09-08까지, 09-11이면 09-09까지). 9월 성수기라 매진 위험. Q20·Q39가 정해지는 즉시 예약해야 하고, 못 잡으면 마리엔 다리·외관·알프제만 보는 것으로 축소.',
    altDetail: null,
    neededOnDate: '2026-09-08',
    neededAtRaw: '09-08까지 (09-10 방문 기준) / 09-09까지 (09-11 방문 기준)',
    resolveHint:
      'Q20·Q39 확정 즉시 공식 예약처에서 시간지정 투어 예약. 매진이면 대안(마리엔 다리·외관·알프제)으로 축소 확정. cities/munich.md 참고.',
    docOrder: 2,
  },
  {
    id: 'gap.venice-0917-plan',
    questionId: 'Q43',
    subject: '베네치아 09-17 본섬 일정',
    kind: 'undecided',
    detail:
      '실질적으로 남은 유일한 “안 정해진 일정”이다. 갈 곳·먹을 곳·본섬 체류 시간 전부 [미정]. 메스트레 → VCE 공항 이동 시간을 먼저 확인해 역산해야 한다(18:30~19:00 공항 도착 필요). cities/venice.md 기준 09-17 뼈대는 오전 체크아웃·짐 맡김(프런트 10:00 오픈) → 본섬 → ~18:00 복귀·짐 회수 → 18:00~18:30 공항 이동 → 21:30 VCE 출발.',
    altDetail: null,
    neededOnDate: '2026-09-17',
    neededAtRaw: '09-17 오전~오후 (~18:00에는 본섬에서 복귀)',
    resolveHint:
      '먼저 메스트레 → VCE 이동 소요시간을 확정(아래 gap.mestre-vce-transfer)한 뒤 역산해 본섬 체류 시간을 정하고, 산 마르코 등 한 지역에 집중하는 동선 1개만 확정. cities/venice.md 참고.',
    docOrder: 3,
  },
  {
    id: 'gap.mestre-vce-transfer',
    questionId: null,
    subject: '메스트레 → VCE 마르코 폴로 공항 이동 수단·소요시간·막차',
    kind: 'unverified',
    detail:
      'cities/venice.md “확인이 필요한 것”에서 문서가 스스로 “← 가장 중요”로 표시한 항목. 09-17 18:00~18:30 구간의 이동 방법이 [확인필요](버스 ATVO/ACTV 등). 09-17 저녁의 핵심 변수라 미리 확인할 것. 21:30 CA974 출발 기준 18:30~19:00 공항 도착 필요.',
    altDetail: null,
    neededOnDate: '2026-09-17',
    neededAtRaw: '09-17 18:00~18:30 (공항 이동)',
    resolveHint:
      'ATVO/ACTV 메스트레역 ↔ VCE 버스 시각표와 소요시간·막차를 출발 전에 캡처해 오프라인 저장. 택시 요금도 백업으로 확인. Q43 역산의 전제값이다.',
    docOrder: 4,
  },

  /* ─── open-questions.md · 💰 기록이 비어 있는 것 ────────────────────── */
  {
    id: 'gap.intl-flight-booking-record',
    questionId: 'Q44',
    subject: '국제선 왕복 항공권 예약처 · 결제자 · 금액',
    kind: 'missing',
    detail:
      '2026-08-03 예매 완료인데 예약처 · 결제자 · 금액이 전부 미기록. 아마 가장 큰 지출이고, 금액이 없어 총 지출에서 빠져 있고 결제자가 없어 정산에도 안 잡혀 있다. 해당 편: CZ316 / CZ345(가는 편), CA974 / CA709(오는 편). ※ 예약번호는 기록하지 않기로 함 [확정, 2026-09-04] — 예약처·결제자·금액만 채운다.',
    altDetail: null,
    neededOnDate: null,
    neededAtRaw: null,
    resolveHint:
      '결제 카드 8월 명세서 또는 예매 확인 메일(dhk0561@naver.com 등)에서 예약처·결제자·금액 3개를 찾아 05-budget.md와 bookings.md에 채운다. 정산 근거라 여행 후에라도 필요.',
    docOrder: 5,
  },
  {
    id: 'gap.ams-stay-address',
    questionId: 'Q45',
    subject: '암스테르담 숙소(베스트웨스턴 자안 인 호텔) 주소 · 예약처',
    kind: 'missing',
    detail:
      '예약처 미기록(결제자는 희성, 534,865원). 주소도 없는데 09-05 도착 당일 필요하다. bookings.md 숙소 표에도 “❗주소 미기록”으로 남아 있다. 09-05 AMS 18:40 도착 후 곧장 찾아가야 하는 값이라 이 목록에서 가장 시급하다.',
    altDetail: null,
    neededOnDate: '2026-09-05',
    neededAtRaw: '09-05 AMS 18:40 도착 직후',
    resolveHint:
      '희성의 예약 확인 메일/앱에서 숙소 전체 주소와 예약처를 옮겨 적고, 출발 전 지도 앱에 오프라인 저장·핀 고정. bookings.md, 04-stays.md에 반영.',
    docOrder: 6,
  },
  {
    id: 'gap.ucl-ticket-price',
    questionId: 'Q46',
    subject: 'UCL 티켓 금액',
    kind: 'missing',
    detail: '예약처(tickets.fcbayern.com) · 결제자(현규) · 정산 여부(안 함)는 확정. 금액만 남음. 채워져도 정산액은 안 바뀐다.',
    altDetail: null,
    neededOnDate: null,
    neededAtRaw: null,
    resolveHint: '현규 카드 명세 또는 fcbayern 예매 확인 메일에서 결제 금액 확인해 05-budget.md에 기록. 정산에는 영향 없음.',
    docOrder: 7,
  },

  /* ─── open-questions.md · 🟡 현장에서 확인·처리할 것 · 돌로미티 ─────── */
  {
    id: 'gap.kreuzwirt-halfboard',
    questionId: 'Q27',
    subject: 'Kreuzwirt 하프보드(조식/석식) 포함 여부 + 조식 시작 시각',
    kind: 'unverified',
    detail: '09-13은 07:35 출발이라 조식을 못 먹을 가능성. 체크인(09-12) 때 확인, 안 되면 전날 빵·커피 확보.',
    altDetail: null,
    neededOnDate: '2026-09-12',
    neededAtRaw: '09-12 체크인 시',
    resolveHint:
      '체크인 때 프런트에 하프보드 포함 여부와 조식 오픈 시각을 묻고, 07:35 출발에 안 맞으면 그날 저녁에 빵·커피를 미리 사 둔다.',
    docOrder: 8,
  },
  {
    id: 'gap.averau-lunch-hours',
    questionId: 'Q31',
    subject: 'Rifugio Averau 정확한 점심 영업시간',
    kind: 'unverified',
    detail: '주방 15:00 마감이라는 과거 후기 있으나 공식 확인 아님. 전화 확인 권장 (+39 0436 4660).',
    altDetail: null,
    neededOnDate: '2026-09-14',
    neededAtRaw: '09-14 점심',
    resolveHint: '전날 또는 당일 오전에 +39 0436 4660으로 전화해 주방 마감 시각 확인. 마감이 이르면 친퀘 토리 일정 순서를 앞당긴다.',
    docOrder: 9,
  },
  {
    id: 'gap.rosengarten-sunset-spot',
    questionId: 'Q26',
    subject: '로젠가르텐 일몰 뷰포인트가 파소 니그라가 맞는지 + 주차 유/무료',
    kind: 'conflicting',
    detail: '파소 니그라가 카티나치오·라테마르 조망 가능한 실제 일몰 명소임은 확인됨. “캠핑의자” 기억 속 스팟과의 일치 여부는 미확인.',
    altDetail: '주차비는 소스마다 상충 — 유료라는 자료와 무료라는 자료가 갈리고, 문서에 구체 금액은 없다.',
    neededOnDate: '2026-09-12',
    neededAtRaw: '09-12 일몰 전',
    resolveHint:
      '현장 도착 후 주차 표지판으로 요금 확인(현금 대비). 뷰포인트가 기억과 다르면 파소 니그라 주변 전망대로 즉시 대체. cities/dolomiti.md 참고.',
    docOrder: 10,
  },
  {
    id: 'gap.cinque-torri-giau-drive',
    questionId: 'Q32',
    subject: '친퀘 토리 → 파소 지아우 정확한 드라이브 거리·시간',
    kind: 'unverified',
    detail: '15~20km / 20~25분 추정. 단일 경로 확정 수치 없음 (현장 내비 기준으로 판단).',
    altDetail: null,
    neededOnDate: '2026-09-14',
    neededAtRaw: '09-14 이동 구간',
    resolveHint: '현장 내비(오프라인 지도 미리 다운로드)로 당일 실측. 추정치 20~25분을 그대로 믿고 일몰 시각을 역산하지 말 것.',
    docOrder: 11,
  },
  {
    id: 'gap.faloria-cablecar',
    questionId: 'Q40',
    subject: '09-15에 팔로리아(Faloria) 케이블카(코르티나) 추가 가능 여부',
    kind: 'undecided',
    detail: '케이블카 존재는 확인. 미수리나/아우론초 동선상 코르티나가 길목이 아니고 09-15 일정이 이미 꽉 차 있음. 여유 생길 때만 검토.',
    altDetail: null,
    neededOnDate: '2026-09-15',
    neededAtRaw: '09-15 (여유 생길 때만)',
    resolveHint: '트레 치메 슬롯(08:30~20:30) 소화 후 시간이 남을 때만 현장에서 판단. 무리해서 넣지 않는다.',
    docOrder: 12,
  },

  /* ─── open-questions.md · 🟡 렌터카 ─────────────────────────────────── */
  {
    id: 'gap.rental-deposit-amount',
    questionId: 'Q35',
    subject: '렌터카 보증금이 €200만인지 €200 + 대여요금인지',
    kind: 'conflicting',
    detail: '[확인필요] — 현장 결제 예상이라 카드 한도 여유 확인 필요. 후보 ①: 보증금 €200만 홀드.',
    altDetail: '후보 ②: €200 + 대여요금이 함께 홀드 (선결제 321,217원과 별개로 잡힐 가능성).',
    neededOnDate: '2026-09-12',
    neededAtRaw: '09-12 13:00 볼차노 공항 픽업 시 현장 결제',
    resolveHint: '픽업 전에 카드 한도를 넉넉히 확보해 두고, 계약서 서명 전 홀드 금액을 직접 확인. 03-driving.md 참고.',
    docOrder: 13,
  },
  {
    id: 'gap.sixt-laim-staffed',
    questionId: 'Q50',
    subject: 'Sixt Laim 24h 지점이 07:00에 유인인지 무인 셀프인지',
    kind: 'unverified',
    detail: '[확인필요] — 무인이면 Sixt 앱 온라인 체크인이 사전에 끝나 있어야 한다. 출발 전 앱 설치·등록으로 대비.',
    altDetail: null,
    neededOnDate: '2026-09-10',
    neededAtRaw: '픽업일 07:00 — 09-10/09-11 중 미정(Q39). 이른 후보일 기준으로 표시.',
    resolveHint:
      '출발 전에 Sixt 앱 설치·계정 등록·온라인 체크인까지 끝내 둔다(무인이어도 되게). +49 89 666 060 60으로 지점 근무 여부를 물어도 된다. 03-driving.md, playbooks/rental-car-issue.md 참고.',
    docOrder: 14,
  },
  {
    id: 'gap.munich-car-fuel-type',
    questionId: 'Q51',
    subject: '뮌헨 렌터카 연료 종류 (Super E10 / E5)',
    kind: 'unverified',
    detail: '픽업 시 주유구 라벨·계약서로 확인. 🚫 Diesel 오주유 절대 금지.',
    altDetail: null,
    neededOnDate: '2026-09-10',
    neededAtRaw: '픽업일 07:00 — 09-10/09-11 중 미정(Q39). 이른 후보일 기준으로 표시.',
    resolveHint:
      '인수 즉시 주유구 라벨을 사진으로 남기고 계약서 연료 표기와 대조. Full-to-Full이라 반납 전 주유 때 이 값이 필요하다. howto/fuel-germany.md 참고.',
    docOrder: 15,
  },
  {
    id: 'gap.dolomiti-car-fuel-policy',
    questionId: 'Q52',
    subject: '돌로미티 렌터카 연료 정책이 Full-to-Full인지',
    kind: 'unverified',
    detail: '픽업(09-12) 시 계약서 확인. 맞다면 09-16 반납 전 볼차노에서 만탱크 + 영수증.',
    altDetail: null,
    neededOnDate: '2026-09-12',
    neededAtRaw: '09-12 13:00 픽업 시 계약서 확인',
    resolveHint:
      '계약서의 연료 정책 항목을 사진으로 남긴다. Full-to-Full이면 09-16 13:00 반납 전 볼차노 주유 + 영수증 보관. howto/fuel-italy.md 참고.',
    docOrder: 16,
  },
  {
    id: 'gap.bolzano-bus-to-avis',
    questionId: 'Q37',
    subject: '09-12 버스 하차지(Via Bruno Buozzi 29/A) → 볼차노 공항 렌터카 지점 약 1.5km 이동 수단',
    kind: 'undecided',
    detail: '도보/택시 중 미정. 하차 12:00, 픽업 13:00으로 1시간 여유.',
    altDetail: null,
    neededOnDate: '2026-09-12',
    neededAtRaw: '09-12 12:00 하차 → 13:00 픽업 사이',
    resolveHint:
      '짐 무게를 보고 현장에서 결정. 도보 경로를 오프라인 지도에 미리 저장하고, 택시 앱/승강장 위치도 함께 확인. cities/dolomiti.md 참고.',
    docOrder: 17,
  },
  {
    id: 'gap.bolzano-airport-to-station',
    questionId: 'Q36',
    subject: '09-16 반납(볼차노 공항 13:00) 후 볼차노 기차역까지 약 3.5km 이동 수단',
    kind: 'undecided',
    detail: '버스/택시 중 미정. 15:31 기차 전까지 여유는 충분. 차 없이 짐을 들고 이동하는 구간이다.',
    altDetail: null,
    neededOnDate: '2026-09-16',
    neededAtRaw: '09-16 13:00 반납 후 → 15:31 보젠역 출발 전',
    resolveHint:
      '공항 앞 시내버스 노선·배차와 택시 대기 여부를 출발 전에 확인해 오프라인 저장. 짐 보관은 14:00~15:15 Base Camp Dolomites(보젠역 앞) 예정이라 시간 여유는 있다. cities/dolomiti.md 참고.',
    docOrder: 18,
  },

  /* ─── open-questions.md · 🟡 그 외 ──────────────────────────────────── */
  {
    id: 'gap.munich-sbahn-works',
    questionId: 'Q41',
    subject: '뮌헨 S-Bahn 간선 공사 (09-08 23:00 ~ 09-14 04:30) 영향',
    kind: 'unverified',
    detail:
      '파싱역 선로 교체로 간선(Stammstrecke)이 축소 운행하고, 별도로 Laim역 개축(2026-08-25~2028) 때문에 시내 방향은 S1·S2·S5만 정차한다. 숙소↔Sixt Laim 지점 이동에 직접 영향 → 택시를 기본으로 하고, 대중교통을 쓰면 당일 아침 MVV/DB 앱 확인. 09-09 ICE 225 도착도 이 기간에 걸쳐 있어 [확인필요].',
    altDetail: null,
    neededOnDate: '2026-09-09',
    neededAtRaw: '09-09 15:46 ICE 225 뮌헨 Hbf 도착 이후 (공사 기간 09-08 23:00~09-14 04:30)',
    resolveHint:
      '당일 아침 MVV/DB 앱에서 운행 변경 확인. 숙소↔Laim 지점은 택시(Taxi München eG +49 89 21610 / FREENOW·Uber·Bolt)를 기본으로 잡는다. 03-driving.md, howto/taxi-munich.md 참고.',
    docOrder: 19,
  },
  {
    id: 'gap.ovpay-travelwallet',
    questionId: 'Q29',
    subject: '트래블월렛 카드로 네덜란드 OVpay 컨택리스 결제(기차 탭인/탭아웃)가 실제 되는지',
    kind: 'unverified',
    detail: '원칙적으로는 될 것으로 보이나 특정 사용 후기 못 찾음. 안 될 경우 대비해 다른 컨택리스 카드 또는 OV-chipkaart 백업 고려.',
    altDetail: null,
    neededOnDate: '2026-09-05',
    neededAtRaw: '09-05 AMS 18:40 도착 후 스히폴 → 시내 기차 첫 탭인',
    resolveHint:
      '첫 탭인에서 실패하면 즉시 다른 컨택리스 카드로 재시도하고, 안 되면 역 창구에서 OV-chipkaart 구매. cities/amsterdam.md 참고.',
    docOrder: 20,
  },
  {
    id: 'gap.venice-frontdesk-luggage',
    questionId: 'Q14-잔여',
    subject: '베네치아 숙소(카 레베카) 프런트 운영시간과 짐 회수 타이밍',
    kind: 'unverified',
    detail: '프런트 운영시간이 10:00~22:00(24시간 아님). 09-17 출국 전 짐 회수 타이밍은 여유 있어 보이나 체크인 때 확인.',
    altDetail: null,
    neededOnDate: '2026-09-16',
    neededAtRaw: '09-16 체크인 시 (짐 회수는 09-17 ~18:00)',
    resolveHint: '체크인 때 짐 보관 가능 시간과 회수 마감을 직접 확인. 09-17 본섬 일정(Q43)은 이 회수 시각에서 역산한다. 04-stays.md 참고.',
    docOrder: 21,
  },
  {
    id: 'gap.travel-insurance-record',
    questionId: 'Q42',
    subject: '여행자보험 보험사 · 증권번호 · 24시간 긴급 연락처',
    kind: 'missing',
    detail:
      '희성이 가입 [확정, 2026-09-04]. 보험사·증권번호·24시간 긴급 연락처가 [확인필요]로 비어 있다. emergency.md “사고 발생 시 순서” 3단계가 “보험사 연락 (희성이 증권 보유)”인데 번호가 문서에 없다.',
    altDetail: null,
    neededOnDate: '2026-09-05',
    neededAtRaw: '출발 전 — 사고 시 즉시 필요하므로 여행 첫날부터 손에 있어야 함',
    resolveHint:
      '희성의 가입 확인 메일에서 보험사명·증권번호·24시간 사고접수 번호를 옮겨 적고, 오프라인(스크린샷)으로 둘 다 저장. emergency.md에 반영.',
    docOrder: 22,
  },
  {
    id: 'gap.cash-euro-strategy',
    questionId: 'Q47',
    subject: '환전/카드 전략 — 현금 유로를 얼마나 들고 갈지',
    kind: 'undecided',
    detail: '[미정]. 돌로미티 일부 주차장은 현금만 받을 수 있음.',
    altDetail: null,
    neededOnDate: '2026-09-05',
    neededAtRaw: '출발 전 (현금 유로 준비) · 실제 필요 구간은 돌로미티 09-12~09-16',
    resolveHint: '돌로미티 주차·소액 결제용 소액권 유로를 출발 전에 확보. 금액은 05-budget.md에서 결정.',
    docOrder: 23,
  },
  {
    id: 'gap.ams-bike-rental',
    questionId: 'Q48',
    subject: '암스테르담 자전거 대여 여부',
    kind: 'undecided',
    detail: '[미정].',
    altDetail: null,
    neededOnDate: null,
    neededAtRaw: '암스테르담 체류 중 (09-05~09-09)',
    resolveHint: '현장에서 날씨·동선 보고 판단. 사전 예약 없이도 대여 가능. cities/amsterdam.md 참고.',
    docOrder: 24,
  },

  /* ─── bookings.md · 숙소 비고 ───────────────────────────────────────── */
  {
    id: 'gap.munich-doorlock-code',
    questionId: null,
    subject: '뮌헨 에어비앤비 스마트 도어록 코드',
    kind: 'missing',
    detail:
      'bookings.md 숙소 비고: “뮌헨: 스마트 도어록, 체크인 48시간 전(09-07경) 코드 안내 예정 [확인필요]”. 09-09 15:46 뮌헨 도착 후 바로 필요한 값인데 아직 문서에 코드가 없다. 숙소는 Fallmerayerstraße 22, 80796 Munich (에어비앤비, 확인번호 HMSMR9PWKH).',
    altDetail: null,
    neededOnDate: '2026-09-09',
    neededAtRaw: '09-09 체크인 (코드 안내는 09-07경 예정)',
    resolveHint: '09-07경 에어비앤비 메시지로 코드가 오면 즉시 오프라인 저장(스크린샷). 09-08까지 안 오면 호스트에게 먼저 문의.',
    docOrder: 25,
  },

  /* ─── emergency.md · [확인필요] ─────────────────────────────────────── */
  {
    id: 'gap.korean-consulate-numbers',
    questionId: null,
    subject: '한국 공관(헤이그·뮌헨·로마) 전화번호',
    kind: 'missing',
    detail:
      'emergency.md “한국 공관 [확인필요 — 출발 전 최신 번호 확인]” 표에 공관 이름만 있고 번호가 없다. 네덜란드=주네덜란드 대사관(헤이그), 독일=주독일 대사관 본분관(뮌헨), 이탈리아=주이탈리아 대사관(로마, 베네치아 관할 확인 필요). 여권 분실 시 필요. 영사콜센터(24시간, 서울) +82-2-3210-0404는 확보돼 있다.',
    altDetail: null,
    neededOnDate: null,
    neededAtRaw: '상시 (여권 분실 등 사고 시)',
    resolveHint:
      '출발 전 각 공관 공식 홈페이지에서 대표번호·긴급전화를 옮겨 적고 emergency.md와 함께 스크린샷으로 오프라인 저장. 베네치아 관할 공관도 함께 확인.',
    docOrder: 26,
  },
  {
    id: 'gap.avis-roadside-number',
    questionId: null,
    subject: 'Avis(돌로미티 렌터카) 긴급출동 번호',
    kind: 'missing',
    detail:
      'emergency.md 예약처·업체 표: “Avis (돌로미티 렌터카) | 긴급출동 번호 [확인필요] | 픽업 시 계약서에서 확인해 여기 적을 것”. 사고 대응 2단계에서 바로 쓰는 번호인데 값이 없다.',
    altDetail: null,
    neededOnDate: '2026-09-12',
    neededAtRaw: '09-12 13:00 픽업 시 계약서에서 옮겨 적기',
    resolveHint: '픽업 즉시 계약서의 roadside assistance 번호를 사진으로 남기고 휴대폰 연락처에 저장. playbooks/rental-car-issue.md 참고.',
    docOrder: 27,
  },
  {
    id: 'gap.sixt-branch-number',
    questionId: null,
    subject: 'Sixt Laim 지점 직통 · 긴급출동 번호',
    kind: 'missing',
    detail:
      '대표번호 +49 89 666 060 60(Sixt 대표, Laim 지점 안내에 표기됨)은 있으나 지점 직통·긴급출동 번호는 [확인필요]. 지점은 Wotanstr. 9, 80639 München · 24시간.',
    altDetail: null,
    neededOnDate: '2026-09-10',
    neededAtRaw: '픽업일 07:00 — 09-10/09-11 중 미정(Q39). 이른 후보일 기준으로 표시.',
    resolveHint: '픽업 시 계약서/영수증의 지점 연락처를 옮겨 적는다. 그 전에는 대표번호 +49 89 666 060 60을 쓴다.',
    docOrder: 28,
  },
  {
    id: 'gap.china-southern-contact',
    questionId: null,
    subject: '중국남방항공(가는 편) 연락처',
    kind: 'missing',
    detail:
      'emergency.md: “중국남방항공 (가는 편) | [확인필요] | CZ316 / CZ345”. 09-05 ICN→PKX→AMS 구간에서 지연·결항 시 필요한 번호가 없다.',
    altDetail: null,
    neededOnDate: '2026-09-05',
    neededAtRaw: '09-05 (CZ316 09:25 ICN 출발 / CZ345 14:15 PKX 출발)',
    resolveHint: '출발 전 중국남방항공 한국 지점 대표번호를 찾아 저장. playbooks/flight-delay.md와 함께 오프라인 보관.',
    docOrder: 29,
  },
  {
    id: 'gap.air-china-contact',
    questionId: null,
    subject: '중국국제항공(오는 편) 연락처',
    kind: 'missing',
    detail:
      'emergency.md: “중국국제항공 (오는 편) | [확인필요] | CA974 / CA709”. 09-17 VCE 21:30 출발과 09-18 PEK 환승 구간에서 필요한 번호가 없다.',
    altDetail: null,
    neededOnDate: '2026-09-17',
    neededAtRaw: '09-17 VCE 21:30 출발 / 09-18 PEK 환승',
    resolveHint: '출발 전 중국국제항공 대표번호(한국·현지)를 찾아 저장. playbooks/flight-delay.md와 함께 오프라인 보관.',
    docOrder: 30,
  },
  {
    id: 'gap.stay-phone-numbers',
    questionId: null,
    subject: '숙소 5곳 전화번호',
    kind: 'missing',
    detail:
      'emergency.md: “숙소 5곳 | [확인필요] | 예약 확인서에서 전화번호 옮겨 적을 것”. 암스테르담·뮌헨·돌로미티 서/동·베네치아 5곳 모두 번호가 없다.',
    altDetail: null,
    neededOnDate: '2026-09-05',
    neededAtRaw: '출발 전 — 첫 체크인(09-05)부터 필요',
    resolveHint:
      '각 예약 확인서(아고다·에어비앤비 등)에서 숙소 전화번호를 옮겨 적어 emergency.md·bookings.md에 채우고 오프라인 저장. 늦은 체크인·길 못 찾을 때 바로 쓰인다.',
    docOrder: 31,
  },
  {
    id: 'gap.card-loss-report-numbers',
    questionId: null,
    subject: '각자 사용 카드사 해외 분실신고 번호',
    kind: 'missing',
    detail:
      'emergency.md 보험·카드 표: “카드 분실신고 | 각자 사용 카드사 해외 분실신고 번호 저장해 둘 것 [확인필요]”. 두 사람 모두 아직 기록 없음.',
    altDetail: null,
    neededOnDate: '2026-09-05',
    neededAtRaw: '출발 전 — 여행 전 기간 상시',
    resolveHint: '각자 쓰는 카드사의 해외 분실신고(수신자부담 포함) 번호를 휴대폰에 저장하고 스크린샷으로 오프라인 보관.',
    docOrder: 32,
  },

  /* ─── prep/documents.md · [확인필요] ────────────────────────────────── */
  {
    id: 'gap.passport-validity',
    questionId: null,
    subject: '여권 유효기간 6개월 이상 여부',
    kind: 'unverified',
    detail:
      'prep/documents.md 여권 행: “[확정] 각자 소지. 여권 사진(사본)을 개인 기기에 보관 중. 유효기간 6개월 이상 [확인필요]”. 두 사람 여권의 만료일이 문서 어디에도 없고, 미달이면 09-05 출국 자체가 막힌다.',
    altDetail: null,
    neededOnDate: '2026-09-05',
    neededAtRaw: '09-05 09:25 ICN 체크인 전 — 출발 전에 반드시',
    resolveHint:
      '두 사람 여권 신원면의 만료일을 직접 눈으로 확인(2027-03-17 이후여야 안전). 미달이면 출발 전 긴급 재발급 외에는 방법이 없다.',
    docOrder: 33,
  },
  {
    id: 'gap.eticket-offline',
    questionId: null,
    subject: '항공권 e-ticket 오프라인 저장',
    kind: 'unverified',
    detail:
      'prep/documents.md: “항공권 e-ticket | [확인필요] | 가는편 CZ316/CZ345, 오는편 CA974/CA709. 오프라인 저장”. 저장했는지 확인되지 않았다.',
    altDetail: null,
    neededOnDate: '2026-09-05',
    neededAtRaw: '출발 전 (09-05 ICN 체크인)',
    resolveHint: '4편 전부 PDF/스크린샷으로 기기에 저장하고 기내모드에서 열리는지 확인.',
    docOrder: 34,
  },
  {
    id: 'gap.stay-voucher-offline',
    questionId: null,
    subject: '숙소 예약 확인서 5곳 오프라인 저장',
    kind: 'unverified',
    detail:
      'prep/documents.md: “숙소 예약 확인서 | [확인필요] | 5곳 전부 예약 완료. 오프라인 저장”. 암스테르담은 주소 자체가 없어(Q45) 저장 전에 주소부터 확보해야 한다.',
    altDetail: null,
    neededOnDate: '2026-09-05',
    neededAtRaw: '출발 전 (09-05 첫 체크인)',
    resolveHint: '5곳 확인서를 PDF/스크린샷으로 저장. 암스테르담은 gap.ams-stay-address 해결이 선행돼야 한다.',
    docOrder: 35,
  },
  {
    id: 'gap.car-voucher-offline',
    questionId: null,
    subject: '렌터카 예약 확인서 오프라인 저장',
    kind: 'unverified',
    detail: 'prep/documents.md: “렌터카 예약 확인서 | [확인필요] | Avis(돌로미티) + 트립닷컴(뮌헨 당일). 오프라인 저장”.',
    altDetail: null,
    neededOnDate: '2026-09-05',
    neededAtRaw: '출발 전 (첫 픽업 09-10 또는 09-11, 본 대여 09-12)',
    resolveHint: 'Avis 1건 + 트립닷컴 2건(09-10/09-11) 확인서를 저장. 09-09에 1건 취소하면 남은 1건을 다시 확인.',
    docOrder: 36,
  },
  {
    id: 'gap.ticket-offline',
    questionId: null,
    subject: '티켓(반고흐·UCL·세체다·트레치메) 오프라인 저장',
    kind: 'unverified',
    detail:
      'prep/documents.md: “티켓 (반고흐·UCL·세체다·트레치메) | [확인필요] | 전부 결제 완료. 오프라인 저장”. 세체다는 €141 환불·변경 불가 30분 슬롯이고 트레치메는 €40 번호판 등록 건이라 티켓을 못 열면 그대로 소멸한다.',
    altDetail: null,
    neededOnDate: '2026-09-05',
    neededAtRaw: '출발 전 (사용일 09-08 / 09-10 / 09-13 / 09-15)',
    resolveHint: '4건 QR·티켓번호를 스크린샷으로 저장하고 기내모드에서 열리는지 확인. 돌로미티는 산간 통신 불안정 구간이 있다.',
    docOrder: 37,
  },
  {
    id: 'gap.card-limit-abroad',
    questionId: null,
    subject: '해외 결제 카드 한도 여유 · 해외결제 활성화',
    kind: 'unverified',
    detail:
      'prep/documents.md: “해외 결제 카드 | [확인필요] | 렌터카 보증금 €200(또는 €200+대여요금) 대비 한도 여유 확보”. 출발 전 마지막 점검 항목에도 “카드 해외결제 활성화 / 한도 확인”이 남아 있다.',
    altDetail: null,
    neededOnDate: '2026-09-05',
    neededAtRaw: '출발 전 — 보증금 홀드는 09-12 13:00 픽업 시',
    resolveHint:
      '카드사 앱에서 해외결제 활성화와 한도를 확인하고, 보증금 금액이 불확실하므로(gap.rental-deposit-amount) 여유분을 크게 잡는다.',
    docOrder: 38,
  },
  {
    id: 'gap.schengen-etias',
    questionId: null,
    subject: '솅겐 무비자 최신 규정 · ETIAS 시행 여부',
    kind: 'unverified',
    detail:
      'prep/documents.md 솅겐 관련: “한국 여권은 솅겐 90/180일 무비자 대상 [확인필요: 최신 규정, ETIAS 시행 여부]”. 베이징 경유는 경유 비자 불필요(항공사 확인 완료).',
    altDetail: null,
    neededOnDate: '2026-09-05',
    neededAtRaw: '출발 전 (09-05 출국 · AMS 입국)',
    resolveHint:
      '외교부 해외안전여행 또는 EU 공식 안내에서 ETIAS 시행 여부와 한국 여권 무비자 조건을 출발 전에 재확인. 시행 중이면 사전 신청 필요.',
    docOrder: 39,
  },
];
