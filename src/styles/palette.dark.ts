import { PaletteOptions } from '@mui/material/styles';

export const paletteDark: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#fafafa',
    light: '#ffffff',
    dark: '#e4e4e7',
    contrastText: '#09090b',
  },
  secondary: {
    main: '#a1a1aa',
    light: '#d4d4d8',
    dark: '#71717a',
    contrastText: '#09090b',
  },
  error: {
    main: '#f87171',
    light: '#fca5a5',
    dark: '#ef4444',
    contrastText: '#09090b',
  },
  warning: {
    main: '#fbbf24',
    light: '#fcd34d',
    dark: '#f59e0b',
    contrastText: '#09090b',
  },
  info: {
    main: '#60a5fa',
    light: '#93c5fd',
    dark: '#3b82f6',
    contrastText: '#09090b',
  },
  success: {
    main: '#4ade80',
    light: '#86efac',
    dark: '#22c55e',
    contrastText: '#09090b',
  },
  background: {
    default: '#09090b',
    paper: '#18181b',
  },
  text: {
    primary: '#fafafa',
    secondary: '#a1a1aa',
    disabled: '#71717a',
  },
  divider: '#27272a',
  action: {
    active: '#fafafa',
    hover: 'rgba(255, 255, 255, 0.08)',
    selected: 'rgba(255, 255, 255, 0.16)',
    disabled: '#52525b',
    disabledBackground: '#27272a',
    focus: 'rgba(255, 255, 255, 0.12)',
  },
};
