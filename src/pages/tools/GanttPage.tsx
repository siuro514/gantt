import { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { Box } from '@mui/material';
import GanttBoard from '@/components/gantt/GanttBoard';
import { useGanttStore } from '@/store/ganttStore';
import Navbar from '@/components/layout/Navbar';

export default function GanttPage() {
  // 甘特圖使用自己的動態主題顏色
  const primaryColor = useGanttStore((state) => state.primaryColor);

  // 為甘特圖創建獨立的主題
  const ganttTheme = useMemo(() => createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: primaryColor, // 使用甘特圖自己的顏色
      },
      secondary: {
        main: '#625B71',
      },
      background: {
        default: '#f7f6f4',
        paper: '#fafafa',
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 20,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontSize: '0.875rem',
          },
        },
      },
    },
  }), [primaryColor]);

  return (
    <>
      <Navbar customColor={primaryColor} />
      <ThemeProvider theme={ganttTheme}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)' }}>
          <GanttBoard />
        </Box>
      </ThemeProvider>
    </>
  );
}

