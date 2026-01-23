import { pxToRem } from '@/styles/css.utils';
import '@/styles/globals.css';
import { paletteDark } from '@/styles/palette.dark';
import { paletteLight } from '@/styles/palette.light';
import { ThemeModeContext } from '@/styles/ThemeModeContext';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider as MuiThemeProvider, PaletteMode, PaletteOptions } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { ReactNode, useMemo, useState } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

const paletteByMode: Record<PaletteMode, PaletteOptions> = {
  light: paletteLight,
  dark: paletteDark,
};

function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<PaletteMode>('light');

  const theme = useMemo(() => {
    const baseTheme = createTheme({
      palette: paletteByMode[mode],
    });

    return createTheme({
      palette: baseTheme.palette,
      shape: {
        borderRadius: pxToRem(8),
      },
      shadows: [
        'none',
        '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      ],
      heights: {
        sm: pxToRem(36),
        md: pxToRem(44),
        lg: pxToRem(52),
      },
      typography: {
        fontFamily: ['Pretendard Variable', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'].join(','),
        h1: {
          fontSize: pxToRem(48),
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
        },
        h2: {
          fontSize: pxToRem(36),
          fontWeight: 700,
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
        },
        h3: {
          fontSize: pxToRem(30),
          fontWeight: 600,
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
        },
        h4: {
          fontSize: pxToRem(24),
          fontWeight: 600,
          letterSpacing: '-0.01em',
          lineHeight: 1.4,
        },
        h5: {
          fontSize: pxToRem(20),
          fontWeight: 600,
          lineHeight: 1.5,
        },
        h6: {
          fontSize: pxToRem(16),
          fontWeight: 600,
          lineHeight: 1.5,
        },
        body1: {
          fontSize: pxToRem(14),
          lineHeight: 1.6,
        },
        body2: {
          fontSize: pxToRem(13),
          lineHeight: 1.5,
        },
      },
      components: {
        MuiButton: {
          defaultProps: {
            disableElevation: true,
          },
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: pxToRem(14),
              borderRadius: 6,
              transition: 'all 0.2s ease',
            },
            sizeSmall: {
              height: pxToRem(36),
              padding: `0 ${pxToRem(12)}`,
              fontSize: pxToRem(13),
            },
            sizeMedium: {
              height: pxToRem(40),
              padding: `0 ${pxToRem(16)}`,
            },
            sizeLarge: {
              height: pxToRem(44),
              padding: `0 ${pxToRem(24)}`,
              fontSize: pxToRem(15),
            },
            contained: {
              '&:hover': {
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              },
            },
            outlined: {
              borderWidth: 1,
              borderColor: baseTheme.palette.divider,
              '&:hover': {
                borderWidth: 1,
                backgroundColor: baseTheme.palette.action.hover,
              },
            },
          },
        },
        MuiCard: {
          defaultProps: {
            elevation: 0,
          },
          styleOverrides: {
            root: {
              borderRadius: 12,
              border: `1px solid ${baseTheme.palette.divider}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: baseTheme.palette.action.disabled,
              },
            },
          },
        },
        MuiPaper: {
          defaultProps: {
            elevation: 0,
          },
          styleOverrides: {
            root: {
              borderRadius: 12,
              border: `1px solid ${baseTheme.palette.divider}`,
              backgroundImage: 'none',
            },
            outlined: {
              border: `1px solid ${baseTheme.palette.divider}`,
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 6,
                transition: 'all 0.2s ease',
                '& fieldset': {
                  borderColor: baseTheme.palette.divider,
                  borderWidth: 1,
                },
                '&:hover fieldset': {
                  borderColor: baseTheme.palette.action.disabled,
                },
                '&.Mui-focused fieldset': {
                  borderWidth: 2,
                },
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 6,
              '& fieldset': {
                borderColor: baseTheme.palette.divider,
              },
              '&:hover fieldset': {
                borderColor: baseTheme.palette.action.disabled,
              },
            },
            input: {
              padding: `${pxToRem(16)} ${pxToRem(14)}`,
              fontSize: pxToRem(14),
              '&.MuiInputBase-inputSizeSmall': {
                padding: `${pxToRem(10)} ${pxToRem(12)}`,
                fontSize: pxToRem(13),
              },
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 6,
              fontWeight: 500,
              fontSize: pxToRem(13),
            },
          },
        },
        MuiAlert: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              border: `1px solid`,
            },
            standard: {
              backgroundColor: baseTheme.palette.background.paper,
            },
          },
        },
        MuiSwitch: {
          styleOverrides: {
            root: {
              width: pxToRem(36),
              height: pxToRem(20),
              padding: 0,
            },
            switchBase: {
              padding: pxToRem(2),
              color: baseTheme.palette.background.paper,
              '&.Mui-checked': {
                color: baseTheme.palette.background.paper,
                transform: `translateX(${pxToRem(16)})`,
                '& + .MuiSwitch-track': {
                  backgroundColor: baseTheme.palette.primary.main,
                  opacity: 1,
                },
              },
            },
            thumb: {
              width: pxToRem(16),
              height: pxToRem(16),
              boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.2)',
            },
            track: {
              borderRadius: pxToRem(10),
              opacity: 1,
              backgroundColor: baseTheme.palette.action.disabled,
            },
          },
        },
        MuiFormControlLabel: {
          styleOverrides: {
            root: {
              gap: pxToRem(8),
              marginLeft: 0,
            },
          },
        },
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              backgroundColor: baseTheme.palette.text.primary,
              color: baseTheme.palette.background.paper,
              fontSize: pxToRem(12),
              borderRadius: 6,
              padding: `${pxToRem(6)} ${pxToRem(12)}`,
            },
            arrow: {
              color: baseTheme.palette.text.primary,
            },
          },
        },
        MuiDivider: {
          styleOverrides: {
            root: {
              borderColor: baseTheme.palette.divider,
            },
          },
        },
      },
    });
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>{children}</SnackbarProvider>
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export default ThemeProvider;
