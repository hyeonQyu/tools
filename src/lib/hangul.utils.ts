const CHOSUNG_LIST = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
] as const;

const HANGUL_SYLLABLE_START = 0xac00;
const HANGUL_SYLLABLE_END = 0xd7a3;
/** 초성 하나가 담당하는 음절 수 (중성 21 * 종성 28) */
const CHOSUNG_UNIT = 588;

/** 한글 음절은 초성으로 바꾸고, 그 외 문자는 그대로 둔다. */
export const getChosung = (text: string): string =>
  Array.from(text)
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code < HANGUL_SYLLABLE_START || code > HANGUL_SYLLABLE_END) return char;
      return CHOSUNG_LIST[Math.floor((code - HANGUL_SYLLABLE_START) / CHOSUNG_UNIT)];
    })
    .join('');

/** 입력이 초성 자모로만 이루어졌는지 (예: 'ㅈㅇㅂ') */
export const checkChosungOnly = (text: string): boolean =>
  text.length > 0 && Array.from(text).every((char) => CHOSUNG_LIST.includes(char as (typeof CHOSUNG_LIST)[number]));

/** 검색 비교용 정규화: 공백 제거 + 소문자화 */
export const normalizeSearchText = (text: string): string => text.replace(/\s+/g, '').toLowerCase();
