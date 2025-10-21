import { useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { zhTW } from 'date-fns/locale';
import GanttBoard from './components/gantt/GanttBoard';
import { useGanttStore } from './store/ganttStore';

function App() {
  const loadData = useGanttStore((state) => state.loadData);
  const primaryColor = useGanttStore((state) => state.primaryColor);

  // 根據 primaryColor 動態創建主題
  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: '#625B71',
      },
      background: {
        default: '#FFFBFE',
        paper: '#FFFBFE',
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

  // 從 localStorage 載入資料
  useEffect(() => {
    const savedData = localStorage.getItem('gantt-data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        // 如果舊資料沒有 projectTitle 或 primaryColor，使用預設值
        if (!data.projectTitle) {
          data.projectTitle = 'Gantt Chart - 團隊任務管理';
        }
        if (!data.primaryColor) {
          data.primaryColor = '#6750A4';
        }
        loadData(data);
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, [loadData]);

  // 自動儲存到 localStorage
  useEffect(() => {
    const unsubscribe = useGanttStore.subscribe((state) => {
      const data = {
        sprints: state.sprints,
        members: state.members,
        tasks: state.tasks,
        projectTitle: state.projectTitle,
        primaryColor: state.primaryColor,
      };
      localStorage.setItem('gantt-data', JSON.stringify(data));
    });

    return () => unsubscribe();
  }, []);

  // 鍵盤快捷鍵
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        const { undo, redo } = useGanttStore.temporal.getState();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhTW}>
        <GanttBoard />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;

