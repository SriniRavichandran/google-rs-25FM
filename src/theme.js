import { createTheme } from '@mui/material/styles';

export const getMuiTheme = (themeName = 'relentless') => {
  const themePresets = {
    relentless: { primary: '#10b981', secondary: '#ef4444', background: '#0b0709', paper: 'rgba(28, 11, 16, 0.85)' },
    cyber: { primary: '#06b6d4', secondary: '#ef4444', background: '#040b14', paper: 'rgba(10, 25, 45, 0.85)' },
    purple: { primary: '#a855f7', secondary: '#ef4444', background: '#0b0616', paper: 'rgba(25, 12, 45, 0.85)' },
    emerald: { primary: '#10b981', secondary: '#ef4444', background: '#020f0a', paper: 'rgba(6, 30, 20, 0.85)' },
    sunset: { primary: '#f59e0b', secondary: '#ef4444', background: '#120903', paper: 'rgba(35, 18, 8, 0.85)' },
    ocean: { primary: '#38bdf8', secondary: '#ef4444', background: '#040d18', paper: 'rgba(10, 28, 50, 0.85)' },
    rose: { primary: '#f43f5e', secondary: '#ef4444', background: '#12050b', paper: 'rgba(35, 10, 20, 0.85)' },
    lime: { primary: '#84cc16', secondary: '#ef4444', background: '#070e03', paper: 'rgba(18, 30, 8, 0.85)' },
    slate: { primary: '#64748b', secondary: '#ef4444', background: '#0f172a', paper: 'rgba(30, 41, 59, 0.85)' }
  };

  const preset = themePresets[themeName] || themePresets.relentless;

  return createTheme({
    palette: {
      mode: 'dark',
      primary: { main: preset.primary },
      secondary: { main: preset.secondary },
      background: {
        default: preset.background,
        paper: preset.paper
      },
      text: {
        primary: '#f8fafc',
        secondary: '#94a3b8'
      }
    },
    typography: {
      fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 800 },
      h5: { fontWeight: 800 },
      h6: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 600 }
    },
    shape: {
      borderRadius: 16
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*': {
            boxSizing: 'border-box',
            margin: 0,
            padding: 0
          },
          html: {
            width: '100%',
            height: '100%',
            scrollBehavior: 'smooth'
          },
          body: {
            width: '100%',
            height: '100%',
            backgroundColor: preset.background,
            color: '#f8fafc',
            fontFamily: '"Outfit", "Inter", sans-serif',
            overflowX: 'hidden'
          },
          '::-webkit-scrollbar': {
            width: '6px',
            height: '6px'
          },
          '::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.2)'
          },
          '::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '4px'
          },
          '::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255, 255, 255, 0.3)'
          },
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          },
          '@keyframes pulseLogo': {
            '0%, 100%': { transform: 'scale(1)', filter: `drop-shadow(0 0 15px ${preset.primary}80)` },
            '50%': { transform: 'scale(1.05)', filter: 'drop-shadow(0 0 25px rgba(239, 68, 68, 0.6))' }
          },
          '@keyframes shimmer': {
            '0%': { transform: 'translateX(-100%) rotate(30deg)' },
            '20%': { transform: 'translateX(100%) rotate(30deg)' },
            '100%': { transform: 'translateX(100%) rotate(30deg)' }
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(16px)',
            background: preset.paper,
            border: '1px solid rgba(255, 255, 255, 0.10)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              borderColor: `${preset.primary}60`,
              boxShadow: `0 0 20px ${preset.primary}30`
            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '8px 20px',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease-in-out'
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(16px)',
            background: preset.paper
          }
        }
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            padding: '12px 16px'
          },
          head: {
            fontWeight: 700,
            color: '#94a3b8',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }
        }
      }
    }
  });
};
