import { logger } from 'firebase-functions';
import { defineSecret } from 'firebase-functions/params';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

/**
 * 해피위크(/tool/happy-week)의 원본 문서를 private 저장소에서 가져온다.
 *
 * 앱의 구조화 스냅샷은 빌드타임에 굽고 일부는 손으로 정규화하므로 여기서 재생성하지 않는다.
 * 이 함수가 하는 일은 두 가지뿐이다:
 *   1. 어느 문서가 스냅샷 이후 바뀌었는지 알려준다 (SHA 대조)
 *   2. 바뀐 문서의 최신 원문을 돌려준다
 *
 * 클라이언트가 이미 아는 SHA를 보내면 바뀐 파일만 내려보낸다. 30개 문서 전부 합쳐도 200KB 남짓이지만
 * 해외 로밍에서 쓰는 앱이라 안 바뀐 것까지 매번 보낼 이유가 없다.
 *
 * PAT는 fine-grained · happy-week 한 저장소 · Contents read-only 로 발급된 것이어야 한다.
 * 등록: `firebase functions:secrets:set GITHUB_TOKEN`
 */

const GITHUB_TOKEN = defineSecret('GITHUB_TOKEN');

const REPO = 'hyeonQyu/happy-week';
const BRANCH = 'develop';
const GITHUB_API = 'https://api.github.com';

/** 문서가 한 번에 다 바뀌어도 이 이상은 없다. 폭주 방어용. */
const MAX_FILES = 60;

type TreeEntry = { path: string; type: string; sha: string; size?: number };

type HappyWeekDocsRequest = {
  /** 클라이언트가 이미 가진 문서의 SHA. 여기 없거나 다른 것만 내려보낸다. */
  knownShas?: Record<string, string>;
};

type HappyWeekDocFile = { path: string; sha: string; content: string };

type HappyWeekDocsResponse = {
  headSha: string;
  fetchedAt: string;
  files: HappyWeekDocFile[];
  /** 이번 응답에서 내려보내지 않은(= 클라이언트 것과 같은) 문서 경로 */
  unchanged: string[];
};

const githubHeaders = (token: string, accept: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: accept,
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'tools-happy-week',
});

const fetchJson = async <T>(url: string, token: string): Promise<T> => {
  const response = await fetch(url, { headers: githubHeaders(token, 'application/vnd.github+json') });
  if (!response.ok) {
    throw new Error(`GitHub ${response.status} ${response.statusText} — ${url}`);
  }
  return (await response.json()) as T;
};

const fetchRaw = async (path: string, token: string): Promise<string> => {
  const url = `${GITHUB_API}/repos/${REPO}/contents/${encodeURI(path)}?ref=${BRANCH}`;
  const response = await fetch(url, { headers: githubHeaders(token, 'application/vnd.github.raw') });
  if (!response.ok) {
    throw new Error(`GitHub ${response.status} ${response.statusText} — ${path}`);
  }
  return response.text();
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const parseKnownShas = (input: unknown): Record<string, string> => {
  if (!isRecord(input) || !isRecord(input.knownShas)) return {};
  const result: Record<string, string> = {};
  for (const [path, sha] of Object.entries(input.knownShas)) {
    if (typeof sha === 'string') result[path] = sha;
  }
  return result;
};

export const getHappyWeekDocs = onCall<HappyWeekDocsRequest>(
  { secrets: [GITHUB_TOKEN] },
  async (request): Promise<HappyWeekDocsResponse> => {
    if (!request.auth?.uid) throw new HttpsError('unauthenticated', '인증이 필요합니다.');

    const token = GITHUB_TOKEN.value();
    if (!token) throw new HttpsError('failed-precondition', 'GITHUB_TOKEN 시크릿이 설정되지 않았습니다.');

    const knownShas = parseKnownShas(request.data);

    try {
      const ref = await fetchJson<{ object: { sha: string } }>(`${GITHUB_API}/repos/${REPO}/git/ref/heads/${BRANCH}`, token);
      const headSha = ref.object.sha;

      const tree = await fetchJson<{ tree: TreeEntry[]; truncated: boolean }>(
        `${GITHUB_API}/repos/${REPO}/git/trees/${headSha}?recursive=1`,
        token,
      );
      if (tree.truncated) logger.warn('happy-week tree truncated');

      const markdown = tree.tree.filter((entry) => entry.type === 'blob' && entry.path.endsWith('.md')).slice(0, MAX_FILES);

      const changed = markdown.filter((entry) => knownShas[entry.path] !== entry.sha);
      const unchanged = markdown.filter((entry) => knownShas[entry.path] === entry.sha).map((entry) => entry.path);

      const files = await Promise.all(
        changed.map(async (entry) => ({ path: entry.path, sha: entry.sha, content: await fetchRaw(entry.path, token) })),
      );

      logger.info('happy-week docs', { headSha, changed: files.length, unchanged: unchanged.length, uid: request.auth.uid });

      return { headSha, fetchedAt: new Date().toISOString(), files, unchanged };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error('happy-week docs failed', { message });
      throw new HttpsError('unavailable', `문서를 가져오지 못했습니다: ${message}`);
    }
  },
);
