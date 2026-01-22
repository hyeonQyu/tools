import { PaletteMode } from '@mui/material';
import { createContext, useContext } from 'react';

export const ThemeModeContext = createContext<{
  mode: PaletteMode;
  setMode: (mode: PaletteMode) => void;
}>({
  mode: 'light',
  setMode: () => {},
});

export const useThemeMode = () => {
  const { mode, setMode } = useContext(ThemeModeContext);
  return { mode, setMode };
};
