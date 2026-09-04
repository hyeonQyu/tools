import { PaletteMode } from '@mui/material';

/** 전면 글라스 디자인 토큰 (시안 v7 기준) */
export interface GlassTokens {
  /** 페이지 바탕색 */
  pageBackground: string;
  /** 바탕 위 저채도 색 번짐 */
  pageBackgroundImage: string;
  /** 유리 시트(Paper, Card, 탭바) 배경 */
  sheetBackground: string;
  /** 유리 시트 테두리 */
  sheetBorder: string;
  /** 유리 시트 그림자 */
  sheetShadow: string;
  /** 유리 시트 블러 필터 */
  sheetBlur: string;
  /** 유리 시트 라운드(px) */
  sheetRadius: number;
  /** 칩·세그먼트 트랙 배경 */
  controlBackground: string;
  /** 입력창 배경 (블러 없이 쓰므로 조금 더 불투명) */
  inputBackground: string;
  /** 팝오버·메뉴처럼 위에 뜨는 유리 (불투명도 높음) */
  popoverBackground: string;
  /** 다이얼로그(전체화면 아님) 유리 */
  dialogBackground: string;
  /** 세그먼트·탭바의 활성 알약 */
  activePill: string;
  /** 활성 알약 그림자 */
  activePillShadow: string;
  /** 시트 안 구분선 */
  hairline: string;
  /** 시트 안 아이콘 자리(툴 선택 등) */
  iconWell: string;
  /** 주요 버튼(검정 유리) 배경 */
  solidBackground: string;
  /** 주요 버튼 hover 배경 */
  solidHoverBackground: string;
  /** 주요 버튼 그림자 */
  solidShadow: string;
}

const SHEET_BLUR = 'blur(28px) saturate(170%)';

export const GLASS_TOKENS: Record<PaletteMode, GlassTokens> = {
  light: {
    pageBackground: '#eef0f5',
    pageBackgroundImage: [
      'radial-gradient(420px 320px at 12% 8%, rgba(120, 132, 230, 0.22), transparent 70%)',
      'radial-gradient(360px 300px at 92% 42%, rgba(80, 170, 150, 0.16), transparent 70%)',
      'radial-gradient(420px 360px at 40% 100%, rgba(235, 190, 160, 0.16), transparent 70%)',
    ].join(', '),
    sheetBackground: 'rgba(255, 255, 255, 0.55)',
    sheetBorder: 'rgba(255, 255, 255, 0.85)',
    sheetShadow: '0 8px 32px rgba(30, 32, 60, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
    sheetBlur: SHEET_BLUR,
    sheetRadius: 18,
    controlBackground: 'rgba(255, 255, 255, 0.55)',
    inputBackground: 'rgba(255, 255, 255, 0.62)',
    popoverBackground: 'rgba(255, 255, 255, 0.86)',
    dialogBackground: 'rgba(255, 255, 255, 0.72)',
    activePill: 'rgba(255, 255, 255, 0.92)',
    activePillShadow: '0 2px 8px rgba(30, 32, 60, 0.1)',
    hairline: 'rgba(24, 24, 27, 0.06)',
    iconWell: 'rgba(255, 255, 255, 0.7)',
    solidBackground: 'rgba(24, 24, 27, 0.88)',
    solidHoverBackground: 'rgba(24, 24, 27, 1)',
    solidShadow: '0 8px 24px rgba(24, 24, 27, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
  },
  dark: {
    pageBackground: '#101116',
    pageBackgroundImage: [
      'radial-gradient(420px 320px at 12% 8%, rgba(120, 132, 230, 0.2), transparent 70%)',
      'radial-gradient(360px 300px at 92% 42%, rgba(80, 170, 150, 0.14), transparent 70%)',
      'radial-gradient(420px 360px at 40% 100%, rgba(235, 190, 160, 0.08), transparent 70%)',
    ].join(', '),
    sheetBackground: 'rgba(28, 30, 38, 0.55)',
    sheetBorder: 'rgba(255, 255, 255, 0.08)',
    sheetShadow: '0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
    sheetBlur: SHEET_BLUR,
    sheetRadius: 18,
    controlBackground: 'rgba(28, 30, 38, 0.55)',
    inputBackground: 'rgba(28, 30, 38, 0.66)',
    popoverBackground: 'rgba(28, 30, 38, 0.9)',
    dialogBackground: 'rgba(28, 30, 38, 0.78)',
    activePill: 'rgba(255, 255, 255, 0.14)',
    activePillShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    hairline: 'rgba(255, 255, 255, 0.08)',
    iconWell: 'rgba(255, 255, 255, 0.1)',
    solidBackground: 'rgba(250, 250, 250, 0.9)',
    solidHoverBackground: 'rgba(250, 250, 250, 1)',
    solidShadow: '0 8px 24px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
  },
};

/** 캡슐 라운드 */
export const CAPSULE_RADIUS = 999;
