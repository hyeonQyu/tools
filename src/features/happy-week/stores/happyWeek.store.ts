import { HappyWeekDocFile, HappyWeekLiveDocs } from '@/features/happy-week/types';
import { toCestDateKey } from '@/features/happy-week/utils';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * 이 도구는 Firestore·React Query·IndexedDB를 쓰지 않는다.
 *
 * 데이터가 사용자 스코프가 아니라 빌드타임 스냅샷 상수이고, 오프라인(해외 로밍·산간)이
 * 전제라 네트워크 왕복은 곧 실패이기 때문이다. 기존 도구의
 * Repository → Service → Query → Hook → Component 흐름이 이 도구에는 존재하지 않는다.
 * 자세한 근거는 src/features/happy-week/README.md 참고.
 *
 * 여기 남는 것은 UI 상태와, 현장에서 사람이 적어 넣는 메모뿐이다. 스냅샷 원본은 불변이다.
 */

const RECENT_QUERY_LIMIT = 3;

export type MunichCarDay = '2026-09-10' | '2026-09-11' | null;
export type HappyWeekView = 'today' | 'trip';

interface HappyWeekStates {
  /** 오늘(레일) / 14일(구간 조망). 세션 한정. */
  currentView: HappyWeekView;
  /** 세션 한정. 앱에 다시 들어오면 항상 오늘로 리셋된다. */
  viewDateKey: string;
  recentQueries: string[];
  /** 지난 마감을 로컬에서만 숨긴다. '완료됨'이라고 기록하지는 않는다. */
  dismissedDeadlineIds: string[];
  /**
   * 뮌헨 렌터카 09-10 / 09-11 중 어느 날로 확정했는가.
   * null이면 두 날 모두 '후보'로 표시한다 — 토글이 틀려 있어서 픽업 앵커가
   * 화면에 아예 없는 최악을 막기 위한 의도적 기본값이다.
   */
  munichCarDay: MunichCarDay;
  /**
   * 문서가 "픽업 시 계약서에서 확인해 여기 적을 것"이라 지시하는 빈 필드들을
   * 현장에서 채워 넣는 자리. key는 contact/fact의 id.
   * 스냅샷을 덮어쓰지 않고 화면에서만 겹쳐 보여준다.
   */
  localNotes: Record<string, string>;
  /**
   * 새로고침으로 받은 최신 원문. 경로별로 누적한다 — 한 번 받은 문서는 다음 응답에 안 와도 남는다.
   * 스냅샷(구조화 데이터)을 덮어쓰지 않는다. 원문 열람과 '무엇이 바뀌었나' 표시에만 쓴다.
   */
  liveDocs: HappyWeekLiveDocs | null;
}

interface HappyWeekActions {
  setCurrentView: (view: HappyWeekView) => void;
  setViewDateKey: (dateKey: string) => void;
  resetViewDateToToday: () => void;
  pushRecentQuery: (query: string) => void;
  clearRecentQueries: () => void;
  toggleDismissedDeadline: (id: string) => void;
  setMunichCarDay: (day: MunichCarDay) => void;
  setLocalNote: (id: string, value: string) => void;
  removeLocalNote: (id: string) => void;
  mergeLiveDocs: (headSha: string, fetchedAt: string, files: HappyWeekDocFile[]) => void;
}

type HappyWeekStore = HappyWeekStates & HappyWeekActions;

const getTodayDateKey = () => toCestDateKey(new Date());

export const useHappyWeekStore = create<HappyWeekStore>()(
  persist(
    (set) => ({
      currentView: 'today',
      viewDateKey: getTodayDateKey(),
      recentQueries: [],
      dismissedDeadlineIds: [],
      munichCarDay: null,
      localNotes: {},
      liveDocs: null,

      setCurrentView: (currentView) => set({ currentView }),

      /** 날짜를 고르면 그 날의 레일로 간다 — 14일 탭에서 행을 눌렀을 때의 자연스러운 결과다. */
      setViewDateKey: (viewDateKey) => set({ viewDateKey, currentView: 'today' }),

      resetViewDateToToday: () => set({ viewDateKey: getTodayDateKey() }),

      pushRecentQuery: (query) =>
        set((state) => {
          const trimmed = query.trim();
          if (!trimmed) return state;

          const next = [trimmed, ...state.recentQueries.filter((q) => q !== trimmed)].slice(0, RECENT_QUERY_LIMIT);
          return { recentQueries: next };
        }),

      clearRecentQueries: () => set({ recentQueries: [] }),

      toggleDismissedDeadline: (id) =>
        set((state) => ({
          dismissedDeadlineIds: state.dismissedDeadlineIds.includes(id)
            ? state.dismissedDeadlineIds.filter((dismissedId) => dismissedId !== id)
            : [...state.dismissedDeadlineIds, id],
        })),

      setMunichCarDay: (munichCarDay) => set({ munichCarDay }),

      setLocalNote: (id, value) =>
        set((state) => ({
          localNotes: { ...state.localNotes, [id]: value },
        })),

      removeLocalNote: (id) =>
        set((state) => ({
          localNotes: Object.fromEntries(Object.entries(state.localNotes).filter(([key]) => key !== id)),
        })),

      mergeLiveDocs: (headSha, fetchedAt, files) =>
        set((state) => ({
          liveDocs: {
            headSha,
            fetchedAt,
            files: { ...(state.liveDocs?.files ?? {}), ...Object.fromEntries(files.map((file) => [file.path, file])) },
          },
        })),
    }),
    {
      name: 'happy-week',
      storage: createJSONStorage(() => localStorage),
      /** viewDateKey는 세션 한정이라 저장하지 않는다. */
      partialize: ({ recentQueries, dismissedDeadlineIds, munichCarDay, localNotes, liveDocs }) => ({
        recentQueries,
        dismissedDeadlineIds,
        munichCarDay,
        localNotes,
        liveDocs,
      }),
    },
  ),
);
