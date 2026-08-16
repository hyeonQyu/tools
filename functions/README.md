# CGV 예매 알림 백엔드 (Cloud Functions)

CGV 내부 API를 주기적으로 폴링해 **예매 오픈 / 신규 회차 / 취소표**를 감지하고 웹푸시로 알려주는 백엔드다.
브라우저에서 CGV API를 직접 호출할 수 없어(CORS 미허용) 극장·영화 목록 조회도 여기 콜러블을 거친다.

루트 프로젝트(Vite + Yarn)와 완전히 분리된 워크스페이스다. **의존성은 npm으로 관리한다.**

## 구성

| 함수                       | 종류         | 하는 일                                                             |
| -------------------------- | ------------ | ------------------------------------------------------------------- |
| `pollCgvWatches`           | `onSchedule` | 2분마다 `cgvWatches`를 훑어 변화를 감지하고 알림 발송               |
| `getCgvCatalog`            | `onCall`     | `{ regions, sites, movies }` 반환 (극장 6시간 / 영화 1시간 캐시)    |
| `getCgvSiteSpecialScreens` | `onCall`     | `{ siteNo }` → 그 극장에서 오늘 운영 중인 특별관 `{ code, name }[]` |

리전은 `src/index.ts`의 `FUNCTIONS_REGION`에서 `asia-northeast3`(서울)로 고정했다.
클라이언트의 `CGV_FUNCTIONS_REGION`(`src/features/cgv-alert/data/cgvCatalog.api.ts`)과 **반드시 같아야 하며**,
다르면 콜러블 호출이 404로 실패한다. 바꿀 때는 **양쪽을 함께** 수정한다.

## 최초 설정 (사람이 직접 해야 하는 것)

1. **Firebase 프로젝트 지정** — `.firebaserc`의 `default`가 비어 있다. 레포 루트에서:

   ```bash
   firebase use --add        # 프로젝트 선택 후 alias를 default로 지정
   ```

2. **Blaze(종량제) 요금제로 전환** — 2세대 Cloud Functions와 Cloud Scheduler는 Spark 요금제에서 배포되지 않는다.
   Firebase 콘솔 > 요금제에서 업그레이드한다. 2분 주기 폴링은 월 약 21,600회 실행이다.

3. **필요한 API 활성화** — 최초 `firebase deploy` 시 CLI가 안내한다.
   (`cloudfunctions`, `cloudbuild`, `cloudscheduler`, `artifactregistry`, `eventarc`, `run`)

4. **웹푸시 VAPID 키 발급** — 콘솔 > 프로젝트 설정 > 클라우드 메시징 > 웹 구성에서 키 쌍을 생성한다.
   이 값은 **클라이언트**가 `getToken(messaging, { vapidKey })`에 쓰며, 서버에는 필요 없다.
   발급된 토큰은 클라이언트가 `pushTokens` 컬렉션에 저장한다(문서 id = 토큰 문자열).

## 배포

```bash
cd functions && npm install     # 최초 1회

# 레포 루트에서
firebase deploy --only functions
firebase deploy --only firestore:rules      # ⚠️ 아래 주의사항 확인
firebase deploy --only firestore:indexes
```

> ⚠️ **`firestore.rules` 배포 전 반드시 확인할 것.**
> 이 레포에는 원래 rules 파일이 없었고 규칙은 콘솔에서 직접 관리되고 있었다.
> `firestore.rules`는 `src/features/*/data/repositories/*.repository.ts`를 전수 조사해 복원한 것이라
> 콘솔의 현재 규칙과 다를 수 있다. 배포하면 콘솔 내용을 **통째로 덮어쓰므로**,
> 반드시 콘솔(Firestore > 규칙)과 대조한 뒤 배포한다.

> `firebase deploy --only firestore:indexes`는 파일에 없는 기존 색인을 지울지 물어본다.
> 기존 색인이 있다면 먼저 `firebase firestore:indexes > firestore.indexes.json`으로 내려받아 병합할 것.

## 폴링 주기 바꾸기

`src/scheduled/pollCgvWatches.ts` 상단:

```ts
const POLL_SCHEDULE = 'every 2 minutes';
const POLL_TIME_ZONE = 'Asia/Seoul';
```

이 값만 고치고 `firebase deploy --only functions:pollCgvWatches`로 재배포하면 된다.
같은 파일의 `MAX_NOTIFICATIONS_PER_WATCH`(감시 항목당 사이클 알림 상한),
`src/types/cgvAlert.types.ts`의 `CGV_MAX_WATCHED_DAYS`(조회 상한 일수)도 여기서 조정한다.

## 폴링 동작 요약

- `enabled == true`인 감시 항목만 대상으로 하고, **극장 단위로 묶어** `fetchOpenDates`를 극장당 1회만 호출한다.
- 회차 조회(`fetchShowtimes`)는 `NEW_SHOWTIME`/`SEAT_AVAILABLE` 트리거가 있을 때만 하고,
  `(siteNo, scnYmd)` 응답을 사이클 내에서 메모이즈해 중복 호출을 막는다.
- 회차 고유키는 `scnYmd|bzplcNo|scnsNo|scnSseq`다. `bzplcNo`를 빼면 같은 `siteNo` 응답에 섞여 오는
  다른 사업장(씨네드쉐프 등) 회차와 충돌한다(실측: 130행 중 116행만 유일).
- **상태 문서가 없는 최초 폴링에서는 알림을 보내지 않고 기준선만 저장한다.**
  같은 이유로, 처음 조회하는 상영일의 회차도 기준선으로만 잡고 `NEW_SHOWTIME`을 발송하지 않는다.
- 상태 배열(`knownShowtimeKeys` 등)에는 현재 응답에 있는 키만 남겨 무한 증가를 막는다.
- 감시 항목 하나가 실패해도 나머지는 계속 처리하며, 실패 사유는 `cgvWatchStates.lastError`에 남는다(성공 시 `null`).

## 로컬 확인

```bash
cd functions
npm run build
npm run serve      # 에뮬레이터 (functions/firestore/auth)
```

에뮬레이터에서 스케줄 함수는 자동 실행되지 않는다. `npm run shell` 후 `pollCgvWatches()`로 수동 실행한다.

## 알아둘 점

- CGV API는 공식 공개 API가 아니다. 사이트 리뉴얼 시 깨질 수 있고, 그때는 `cgvWatchStates.lastError`와
  Cloud Functions 로그에 파싱/HTTP 오류가 남는다.
- Cloudflare가 curl류 클라이언트를 403으로 막지만 Node의 native fetch는 브라우저 UA/Referer만 붙이면 통과한다.
  **우회 라이브러리를 추가하지 말 것.**
- CGV는 자정을 넘긴 회차를 `2445`처럼 24시 이상으로 표기한다. 시간 필터는 1440분으로 나눈 나머지로 비교한다.
