import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#037B41',
      light: '#059451',
      dark: '#025D31',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#fee2e2',
    },
    neutral: {
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    body1: {
      letterSpacing: '-0.005em',
    },
    body2: {
      letterSpacing: '-0.005em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(16, 24, 40, 0.05)',
    '0px 2px 4px rgba(16, 24, 40, 0.05)',
    '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
    '0px 6px 12px -2px rgba(16, 24, 40, 0.1), 0px 3px 5px -3px rgba(16, 24, 40, 0.05)',
    '0px 8px 16px -2px rgba(16, 24, 40, 0.1), 0px 4px 6px -2px rgba(16, 24, 40, 0.05)',
    '0px 12px 24px -4px rgba(16, 24, 40, 0.1), 0px 6px 12px -6px rgba(16, 24, 40, 0.1)',
    '0px 16px 32px -4px rgba(16, 24, 40, 0.1), 0px 8px 16px -6px rgba(16, 24, 40, 0.1)',
    '0px 20px 40px -4px rgba(16, 24, 40, 0.1), 0px 12px 24px -12px rgba(16, 24, 40, 0.1)',
    '0px 24px 48px -4px rgba(16, 24, 40, 0.1), 0px 20px 32px -8px rgba(16, 24, 40, 0.1)',
    '0px 32px 64px -8px rgba(16, 24, 40, 0.12), 0px 28px 40px -4px rgba(16, 24, 40, 0.1)',
    // Additional shadows 11-24 unchanged
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          padding: '10px 20px',
          fontWeight: 600,
          '&:hover': {
            boxShadow: '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#059451',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 6px -1px rgba(16, 24, 40, 0.05), 0px 2px 4px -2px rgba(16, 24, 40, 0.03)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
          border: '1px solid rgba(203, 213, 225, 0.5)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 24px -4px rgba(16, 24, 40, 0.08), 0px 6px 12px -6px rgba(16, 24, 40, 0.04)',
            borderColor: 'rgba(203, 213, 225, 0.8)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#037B41',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
        },
        notchedOutline: {
          borderColor: 'rgba(203, 213, 225, 0.8)',
          transition: 'border-color 0.2s ease-in-out',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            backgroundColor: '#ffffff',
          },
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff88',
      light: '#33ffa0',
      dark: '#00cc6d',
      contrastText: '#000000',
    },
    secondary: {
      main: '#00ffff',
      light: '#33ffff',
      dark: '#00cccc',
    },
    background: {
      default: '#000000',
      paper: '#111111',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
    error: {
      main: '#ff4444',
      light: '#ff6666',
    },
    neutral: {
      100: '#111111',
      200: '#222222',
      300: '#333333',
      400: '#444444',
      500: '#666666',
      600: '#888888',
      700: '#aaaaaa',
      800: '#cccccc',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      color: '#ffffff',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      color: '#ffffff',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      color: '#ffffff',
    },
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#ffffff',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.015em',
      color: '#ffffff',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      color: '#ffffff',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
      color: '#ffffff',
    },
    body1: {
      letterSpacing: '-0.005em',
      color: '#ffffff',
    },
    body2: {
      letterSpacing: '-0.005em',
      color: '#cccccc',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.3)',
    '0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 4px 8px rgba(0, 0, 0, 0.3)',
    '0px 6px 12px rgba(0, 0, 0, 0.3)',
    '0px 8px 16px rgba(0, 0, 0, 0.3)',
    '0px 12px 24px rgba(0, 0, 0, 0.3)',
    '0px 16px 32px rgba(0, 0, 0, 0.3)',
    '0px 20px 40px rgba(0, 0, 0, 0.3)',
    '0px 24px 48px rgba(0, 0, 0, 0.3)',
    '0px 32px 64px rgba(0, 0, 0, 0.3)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          padding: '10px 20px',
          fontWeight: 600,
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#00ff88',
          },
        },
        text: {
          color: '#ffffff',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
          backgroundColor: '#111111',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'all 0.2s ease-in-out',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: '#111111',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.3)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#111111',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00ff88',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
        },
        notchedOutline: {
          borderColor: 'rgba(255, 255, 255, 0.1)',
          transition: 'border-color 0.2s ease-in-out',
        },
        input: {
          color: '#ffffff',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 500,
          color: '#ffffff',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          '&.Mui-selected': {
            color: '#00ff88',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#00ff88',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111111',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

export { lightTheme, darkTheme };