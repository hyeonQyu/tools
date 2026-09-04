import { pxToRem } from '@/styles/css.utils';
import { CAPSULE_RADIUS, GLASS_TOKENS } from '@/styles/glass.constants';
import '@/styles/globals.css';
import { BOTTOM_NAVIGATION_CLEARANCE } from '@/styles/layout.constants';
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
    const glass = GLASS_TOKENS[mode];
    const { palette } = baseTheme;

    const glassSheet = {
      backgroundColor: glass.sheetBackground,
      backgroundImage: 'none',
      border: `1px solid ${glass.sheetBorder}`,
      borderRadius: glass.sheetRadius,
      boxShadow: glass.sheetShadow,
      backdropFilter: glass.sheetBlur,
      WebkitBackdropFilter: glass.sheetBlur,
    } as const;

    const glassControl = {
      backgroundColor: glass.controlBackground,
      border: `1px solid ${glass.sheetBorder}`,
      backdropFilter: glass.sheetBlur,
      WebkitBackdropFilter: glass.sheetBlur,
    } as const;

    return createTheme({
      palette,
      glass,
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
          letterSpacing: '-0.01em',
          lineHeight: 1.4,
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
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: glass.pageBackground,
            },
            // notistack 토스트: 탭바 위에 검정 유리 캡슐로 띄우고, 토스트 본체만 클릭을 받는다.
            // 위치(bottom)는 notistack이 런타임에 생성하는 익명 클래스가 잡고 있어 일반 선택자로는
            // 못 이긴다. SnackbarProvider의 classes.containerAnchorOriginBottomCenter로 우리
            // 클래스를 얹고 !important로 확실히 덮어쓴다.
            '.tools-toast-container': {
              bottom: `${pxToRem(BOTTOM_NAVIGATION_CLEARANCE)} !important`,
            },
            '.notistack-SnackbarContainer': {
              pointerEvents: 'none',
              '& .notistack-MuiContent': {
                pointerEvents: 'auto',
                backgroundColor: glass.solidBackground,
                color: palette.primary.contrastText,
                borderRadius: CAPSULE_RADIUS,
                boxShadow: glass.solidShadow,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                padding: `${pxToRem(6)} ${pxToRem(18)}`,
                fontSize: pxToRem(13),
                fontWeight: 500,
              },
            },
          },
        },
        MuiButton: {
          defaultProps: {
            disableElevation: true,
          },
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: pxToRem(14),
              borderRadius: CAPSULE_RADIUS,
              transition: 'all 0.2s ease',
            },
            sizeSmall: {
              height: pxToRem(36),
              padding: `0 ${pxToRem(14)}`,
              fontSize: pxToRem(13),
            },
            sizeMedium: {
              height: pxToRem(40),
              padding: `0 ${pxToRem(18)}`,
            },
            sizeLarge: {
              height: pxToRem(48),
              padding: `0 ${pxToRem(24)}`,
              fontSize: pxToRem(15),
            },
            containedPrimary: {
              backgroundColor: glass.solidBackground,
              boxShadow: glass.solidShadow,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              '&:hover': {
                backgroundColor: glass.solidHoverBackground,
                boxShadow: glass.solidShadow,
              },
            },
            outlined: {
              ...glassControl,
              borderWidth: 1,
              boxShadow: glass.sheetShadow,
              '&:hover': {
                borderWidth: 1,
                borderColor: glass.sheetBorder,
                backgroundColor: glass.activePill,
              },
            },
          },
        },
        MuiPaper: {
          defaultProps: {
            elevation: 0,
          },
          styleOverrides: {
            root: glassSheet,
            outlined: {
              border: `1px solid ${glass.sheetBorder}`,
            },
          },
        },
        MuiCard: {
          defaultProps: {
            elevation: 0,
          },
          styleOverrides: {
            root: {
              ...glassSheet,
              transition: 'all 0.2s ease',
            },
          },
        },
        MuiMenu: {
          styleOverrides: {
            paper: {
              backgroundColor: glass.popoverBackground,
            },
          },
        },
        MuiPopover: {
          styleOverrides: {
            paper: {
              backgroundColor: glass.popoverBackground,
            },
          },
        },
        MuiAutocomplete: {
          styleOverrides: {
            paper: {
              backgroundColor: glass.popoverBackground,
            },
            // 클리어/드롭다운 아이콘도 이미 absolute라서 fieldset과 같은 층이라, DOM
            // 순서상 fieldset이 나중에 그려져 위를 덮는다. z-index로 명시적으로 올린다.
            endAdornment: {
              zIndex: 1,
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              backgroundColor: glass.dialogBackground,
            },
            paperFullScreen: {
              borderRadius: 0,
              border: 'none',
              boxShadow: 'none',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              backgroundColor: glass.pageBackground,
              backgroundImage: glass.pageBackgroundImage,
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
            },
          },
        },
        MuiDialogTitle: {
          styleOverrides: {
            root: {
              fontSize: pxToRem(20),
              fontWeight: 600,
              letterSpacing: '-0.01em',
            },
          },
        },
        MuiInputLabel: {
          styleOverrides: {
            // 라벨은 캡션처럼 입력창 위에 얹는다: 테두리에 걸치는 Material 기본 노치 스타일을 쓰지 않는다.
            outlined: {
              fontSize: pxToRem(12),
              fontWeight: 500,
              color: palette.text.secondary,
              // Stack spacing(보통 16px)보다 작게 띄워 이전 필드와 겹치지 않게 한다.
              transform: `translate(0, ${pxToRem(-14)}) scale(1)`,
              '&.Mui-focused': {
                color: palette.text.secondary,
              },
              '&.MuiInputLabel-shrink': {
                transform: `translate(0, ${pxToRem(-14)}) scale(1)`,
              },
            },
          },
        },
        MuiInputAdornment: {
          styleOverrides: {
            // MuiOutlinedInput.input과 같은 이유로 fieldset 배경 위로 끌어올린다.
            root: {
              position: 'relative',
              zIndex: 1,
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            // 배경은 fieldset(outline)에 둔다: root에 두면 fieldset이 위로 5px 더 뻗는 MUI 기본
            // 노치 여백(top: -5) 때문에 캡슐 라운드에서 배경 없는 테두리 조각이 떠 보인다.
            root: {
              borderRadius: CAPSULE_RADIUS,
              transition: 'all 0.2s ease',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: glass.sheetBorder,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: palette.accent.main,
                borderWidth: 1.5,
              },
              '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                borderColor: palette.error.main,
              },
              '&.MuiInputBase-multiline': {
                borderRadius: glass.sheetRadius,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderRadius: glass.sheetRadius,
                },
              },
            },
            notchedOutline: {
              top: 0,
              borderColor: glass.sheetBorder,
              borderWidth: 1,
              backgroundColor: glass.inputBackground,
              // 라벨이 더 이상 테두리에 걸치지 않으므로, 테두리를 끊는 노치 자체를 없앤다.
              legend: {
                maxWidth: 0,
              },
            },
            input: {
              padding: `${pxToRem(14)} ${pxToRem(16)}`,
              fontSize: pxToRem(14),
              fontWeight: 500,
              // fieldset(=notchedOutline)이 배경을 들고 있고 absolute라서, static인 입력
              // 텍스트보다 항상 위에 페인트되어 반투명 흰 배경이 글자를 덮어 흐리게 만들었다.
              // 글자 쪽을 끌어올려 그 위에 그려지게 한다.
              position: 'relative',
              zIndex: 1,
              '&.MuiInputBase-inputSizeSmall': {
                padding: `${pxToRem(10)} ${pxToRem(14)}`,
                fontSize: pxToRem(13),
              },
            },
          },
        },
        MuiPickersOutlinedInput: {
          styleOverrides: {
            // OutlinedInput과 같은 이유로 배경은 root가 아니라 notchedOutline(fieldset)에 둔다.
            root: {
              borderRadius: CAPSULE_RADIUS,
              '&:hover .MuiPickersOutlinedInput-notchedOutline': {
                borderColor: glass.sheetBorder,
              },
              '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
                borderColor: palette.accent.main,
                borderWidth: 1.5,
              },
            },
            notchedOutline: {
              top: 0,
              borderColor: glass.sheetBorder,
              borderWidth: 1,
              backgroundColor: glass.inputBackground,
            },
            sectionsContainer: {
              padding: `${pxToRem(14)} 0`,
              fontSize: pxToRem(14),
              fontWeight: 500,
              // OutlinedInput.input과 같은 이유로 fieldset 배경 위로 끌어올린다.
              position: 'relative',
              zIndex: 1,
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: CAPSULE_RADIUS,
              fontWeight: 500,
              fontSize: pxToRem(13),
            },
            outlined: {
              backgroundColor: glass.controlBackground,
              borderColor: glass.sheetBorder,
            },
          },
        },
        MuiTabs: {
          styleOverrides: {
            root: {
              ...glassControl,
              minHeight: pxToRem(44),
              padding: pxToRem(4),
              borderRadius: CAPSULE_RADIUS,
            },
            flexContainer: {
              position: 'relative',
              zIndex: 1,
              height: '100%',
            },
            indicator: {
              height: '100%',
              borderRadius: CAPSULE_RADIUS,
              backgroundColor: glass.activePill,
              boxShadow: glass.activePillShadow,
              zIndex: 0,
            },
          },
        },
        MuiTab: {
          styleOverrides: {
            root: {
              minHeight: pxToRem(36),
              padding: `${pxToRem(6)} ${pxToRem(12)}`,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: pxToRem(13),
              color: palette.text.secondary,
              borderRadius: CAPSULE_RADIUS,
              '&.Mui-selected': {
                color: palette.text.primary,
              },
            },
          },
        },
        MuiToggleButtonGroup: {
          styleOverrides: {
            root: {
              ...glassControl,
              padding: pxToRem(4),
              borderRadius: CAPSULE_RADIUS,
              gap: pxToRem(2),
              '& .MuiToggleButton-root': {
                border: 0,
                margin: 0,
                borderRadius: CAPSULE_RADIUS,
              },
            },
          },
        },
        MuiToggleButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: pxToRem(13),
              color: palette.text.secondary,
              padding: `${pxToRem(6)} ${pxToRem(12)}`,
              '&.Mui-selected': {
                color: palette.text.primary,
                backgroundColor: glass.activePill,
                boxShadow: glass.activePillShadow,
                '&:hover': {
                  backgroundColor: glass.activePill,
                },
              },
            },
          },
        },
        MuiAlert: {
          styleOverrides: {
            root: {
              borderRadius: glass.sheetRadius,
              border: `1px solid ${glass.sheetBorder}`,
              backdropFilter: glass.sheetBlur,
              WebkitBackdropFilter: glass.sheetBlur,
            },
            standard: {
              backgroundColor: glass.sheetBackground,
            },
          },
        },
        MuiSwitch: {
          styleOverrides: {
            root: {
              width: pxToRem(44),
              height: pxToRem(26),
              padding: 0,
            },
            switchBase: {
              padding: pxToRem(3),
              color: '#ffffff',
              '&.Mui-checked': {
                color: '#ffffff',
                transform: `translateX(${pxToRem(18)})`,
                '& + .MuiSwitch-track': {
                  backgroundColor: palette.accent.main,
                  opacity: 1,
                },
              },
            },
            thumb: {
              width: pxToRem(20),
              height: pxToRem(20),
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.2)',
            },
            track: {
              borderRadius: pxToRem(13),
              opacity: 1,
              backgroundColor: palette.action.disabled,
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.08)',
            },
          },
        },
        MuiCheckbox: {
          styleOverrides: {
            root: {
              color: palette.action.disabled,
              '&.Mui-checked': {
                color: palette.accent.main,
              },
            },
          },
        },
        MuiRadio: {
          styleOverrides: {
            root: {
              '&.Mui-checked': {
                color: palette.accent.main,
              },
            },
          },
        },
        MuiLinearProgress: {
          styleOverrides: {
            root: {
              height: pxToRem(6),
              borderRadius: pxToRem(3),
              backgroundColor: glass.controlBackground,
            },
            bar: {
              borderRadius: pxToRem(3),
              backgroundColor: palette.accent.main,
            },
          },
        },
        MuiAccordion: {
          styleOverrides: {
            root: {
              '&::before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: 0,
              },
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
              backgroundColor: palette.text.primary,
              color: palette.background.paper,
              fontSize: pxToRem(12),
              borderRadius: 8,
              padding: `${pxToRem(6)} ${pxToRem(12)}`,
            },
            arrow: {
              color: palette.text.primary,
            },
          },
        },
        MuiDivider: {
          styleOverrides: {
            root: {
              borderColor: glass.hairline,
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
        <SnackbarProvider classes={{ containerAnchorOriginBottomCenter: 'tools-toast-container' }}>{children}</SnackbarProvider>
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export default ThemeProvider;
