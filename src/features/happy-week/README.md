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

## 데이터 갱신 — 두 층

**구조화 스냅샷**(`data/snapshot.ts`)은 개발 시점에 굽는다. 시드의 약 10%(고정 앵커·마감·긴급번호 등
"틀리면 여행이 망하는" 값)는 손으로 정규화했기 때문에 런타임에 재생성하지 않는다.
`yarn happy-week:validate`가 Zod + dangling 참조 + 시각 변환 + hard/headline을 검증한다.

**최신 원문**은 헤더의 새로고침 버튼이 받아온다 (`data/happyWeekDocs.api.ts` →
callable `getHappyWeekDocs`, `functions/src/callable/getHappyWeekDocs.ts`).

- 스냅샷을 구울 때의 문서 SHA(`data/sourceShas.ts`)를 보내면 **바뀐 문서만** 돌아온다.
- 결과는 `localStorage`(`liveDocs`)에 누적된다. 구조화 데이터를 덮어쓰지 않는다.
- 헤더에 `원문 변경 N` 칩이 뜨고, 각 아이템 시트 하단에서 해당 문서의 최신 원문을 읽을 수 있다.
- 오프라인이면 실패하고, 실패해도 앱은 스냅샷으로 그대로 동작한다.

서버는 `GITHUB_TOKEN` 시크릿(fine-grained PAT · happy-week 한 저장소 · Contents read-only)이 필요하다.
`firebase functions:secrets:set GITHUB_TOKEN` — **버전이 없으면 함수 배포 자체가 실패한다.**

`sourceShas.ts` 재생성:

```bash
gh api "repos/hyeonQyu/happy-week/git/trees/develop?recursive=1" --jq '.tree[] | select(.path|endswith(".md")) | "\(.path)\t\(.sha)"'
```

`meta.builtAt`이 스냅샷 기준일이고 화면에 항상 표시된다 — 원문 문서 스스로가
"여기 적힌 요금·영업시간은 조사 시점 기준이다. 현장에서 다르면 현장이 맞다"고 선언하기 때문이다.
