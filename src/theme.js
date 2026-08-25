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
      fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 800 },
      h6: { fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 600 }
    },
    shape: {
      borderRadius: 16
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(16px)',
            background: preset.paper,
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              borderColor: preset.primary,
              boxShadow: `0 0 20px ${preset.primary}40`
            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '8px 20px',
            fontSize: '0.9rem'
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
      }
    }
  });
};
