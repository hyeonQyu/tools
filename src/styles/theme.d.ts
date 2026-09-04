import type { GlassTokens } from '@/styles/glass.constants';
import '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';

declare module '@mui/material/styles' {
  interface Theme {
    heights: {
      sm: string;
      md: string;
      lg: string;
    };
    glass: GlassTokens;
  }
  interface ThemeOptions {
    heights?: {
      sm: string;
      md: string;
      lg: string;
    };
    glass?: GlassTokens;
  }
  interface Palette {
    /** 진행 바·활성 상태·포커스 링에 쓰는 유일한 포인트 색 */
    accent: Palette['primary'];
  }
  interface PaletteOptions {
    accent?: PaletteOptions['primary'];
  }
}
