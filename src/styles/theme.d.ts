import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    heights: {
      sm: string;
      md: string;
      lg: string;
    };
  }
  interface ThemeOptions {
    heights?: {
      sm: string;
      md: string;
      lg: string;
    };
  }
}
