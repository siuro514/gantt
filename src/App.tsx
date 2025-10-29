import { useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { zhTW } from 'date-fns/locale';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useGanttStore } from './store/ganttStore';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import GanttPage from './pages/tools/GanttPage';
import JsonParserPage from './pages/tools/JsonParserPage';
import Base64Page from './pages/tools/Base64Page';
import ImageCompressorPage from './pages/tools/ImageCompressorPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';

function App() {
  const loadData = useGanttStore((state) => state.loadData);

  // 主網站使用固定的鐵灰色主題
  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#3a3a3a', // 固定的鐵灰色，不受甘特圖影響
      },
      secondary: {
        main: '#625B71',
      },
      background: {
        default: '#f7f6f4', // 暖灰调雾面背景，与铁灰色系更搭配
        paper: '#fafafa',   // 卡片背景，稍亮一些以保持层次感
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
  }), []); // 不依賴任何動態值，主題保持固定

  // 從 localStorage 載入資料（不記錄到 undo 歷史）
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
        
        // 暫停歷史記錄，避免加載數據時記錄到 undo 歷史
        useGanttStore.temporal.getState().pause();
        loadData(data);
        // 清空當前的 undo/redo 歷史，從乾淨的狀態開始
        useGanttStore.temporal.getState().clear();
        useGanttStore.temporal.getState().resume();
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
        <BrowserRouter>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
              <Route path="/tools/gantt" element={<GanttPage />} />
              <Route path="/tools/json-parser" element={<><Navbar /><JsonParserPage /><Footer /></>} />
              <Route path="/tools/base64" element={<><Navbar /><Base64Page /><Footer /></>} />
              <Route path="/tools/image-compressor" element={<><Navbar /><ImageCompressorPage /><Footer /></>} />
              <Route path="/about" element={<><Navbar /><AboutPage /><Footer /></>} />
              <Route path="/blog" element={<><Navbar /><BlogPage /><Footer /></>} />
              <Route path="/privacy" element={<><Navbar /><PrivacyPage /><Footer /></>} />
              <Route path="/terms" element={<><Navbar /><TermsPage /><Footer /></>} />
            </Routes>
          </Box>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;

