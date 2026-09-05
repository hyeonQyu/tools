import { HappyWeekLiveDocs, HappyWeekSnapshot } from '@/features/happy-week/types';

/** 스냅샷 이후 바뀐 문서 경로. 새로고침으로 받은 SHA와 구울 때의 SHA를 대조한다. */
export const getChangedDocPaths = (snapshot: HappyWeekSnapshot, liveDocs: HappyWeekLiveDocs | null): string[] => {
  if (!liveDocs) return [];
  return Object.values(liveDocs.files)
    .filter((file) => snapshot.meta.sourceShas[file.path] !== file.sha)
    .map((file) => file.path)
    .sort();
};

/** 새로고침 요청에 실어 보낼 "이미 아는 SHA". 받은 것이 있으면 그것을, 없으면 스냅샷 것을 쓴다. */
export const getKnownDocShas = (snapshot: HappyWeekSnapshot, liveDocs: HappyWeekLiveDocs | null): Record<string, string> => {
  const known = { ...snapshot.meta.sourceShas };
  for (const file of Object.values(liveDocs?.files ?? {})) known[file.path] = file.sha;
  return known;
};

/**
 * 아이템의 sourceDoc은 'trip/bookings.md' 하나이거나, 병합/시드에서 온
 * 'a.md + b.md' · 'a.md, b.md' 형태다. 구분자를 가리지 않고 경로를 뽑는다.
 */
export const getLiveDocsForSource = (sourceDoc: string, snapshot: HappyWeekSnapshot, liveDocs: HappyWeekLiveDocs | null) =>
  sourceDoc
    .split(/\s*[+,]\s*/)
    .map((path) => path.trim())
    .filter(Boolean)
    .map((path) => {
      const file = liveDocs?.files[path] ?? null;
      const changed = file !== null && snapshot.meta.sourceShas[path] !== file.sha;
      return { path, file, changed };
    });
