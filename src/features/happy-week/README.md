# happy-week

2026-09-05 ~ 09-18 유럽 여행(암스테르담 → 뮌헨 → 돌로미티 → 베네치아)의 계획 문서를
여행 중에 쓸 수 있는 형태로 보여주는 도구다. 라우트는 `/tool/happy-week`.

원본은 private 저장소 [`hyeonQyu/happy-week`](https://github.com/hyeonQyu/happy-week)의
마크다운 30개(약 192KB)다. **마크다운을 그대로 렌더링하지 않는다** — 구조와 데이터만 뽑아
전용 화면으로 재구성한다.

## 이 도구가 프로젝트 규칙을 따르지 않는 지점

`.agents/rules/common.md`의 "최소 영향" 원칙에 따라, 규칙에서 벗어난 곳과 그 이유를 여기 남긴다.

### 1. Repository → Service → Query → Hook → Component 흐름이 없다

데이터가 사용자 스코프가 아니라 **빌드타임 스냅샷 상수**(`data/snapshot.ts`)다.
Firestore·React Query·IndexedDB를 쓰지 않는다.

근거:

- 해외 로밍과 산간 지역이 사용 환경이다. 네트워크 왕복은 곧 실패다.
- 읽기 전용 데이터이고 사용자별로 달라지지 않는다.
- 스냅샷이 번들에 포함되므로 PWA 서비스워커 precache가 그대로 오프라인 보장을 준다.

남는 상태는 UI 상태와 현장 메모뿐이고 `stores/happyWeek.store.ts`의 Zustand + localStorage가 맡는다.

### 2. KST 유틸을 쓰지 않는다

`.agents/rules/architecture.md`는 모든 날짜 처리에 `src/lib/time.utils.ts`의 KST 유틸을 요구한다.
이 도구는 `utils/tripTime.utils.ts`의 CEST(UTC+2) 유틸을 쓴다.

근거: 여행 문서의 모든 시각이 유럽 현지 시각이다. KST 유틸을 태우면 전 일정이 **7시간 틀어진다**.
KST 유틸을 대체하지 않고 형제로 복제했으므로 다른 도구는 영향을 받지 않는다.

고정 +2가 안전한 이유는 `tripTime.utils.ts` 상단 주석에 적어 두었다.

## 데이터 갱신

스냅샷은 원문 문서에서 만들어진다. 문서가 갱신되면 스냅샷을 다시 구워야 반영된다.
자세한 절차는 `scripts/happy-week/` 참고.

`meta.builtAt`이 스냅샷 기준일이고 화면에 항상 표시된다 — 원문 문서 스스로가
"여기 적힌 요금·영업시간은 조사 시점 기준이다. 현장에서 다르면 현장이 맞다"고 선언하기 때문이다.
