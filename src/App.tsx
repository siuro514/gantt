import { useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { zhTW } from 'date-fns/locale';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGanttStore } from './store/ganttStore';
import { LanguageRouter, RootRedirect } from './components/LanguageRouter';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import GanttPage from './pages/tools/GanttPage';
import JsonParserPage from './pages/tools/JsonParserPage';
import Base64Page from './pages/tools/Base64Page';
import CryptoPage from './pages/tools/CryptoPage';
import ImageCompressorPage from './pages/tools/ImageCompressorPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import AboutPage from './pages/AboutPage';
import GanttGuidePage from './pages/GanttGuidePage';
import FAQPage from './pages/FAQPage';

// 组件用于设置页面标题和 SEO meta 标签
function DocumentTitle() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const baseTitle = t('site.title'); // Ganttleman
    const baseDescription = t('site.description');
    
    // 设置 html lang 属性
    document.documentElement.lang = i18n.language;
    
    // 页面标题映射
    const pathTitleMap: Record<string, string> = {
      '/tools/gantt': t('tools.gantt.name'),
      '/tools/json-parser': t('tools.jsonParser.name'),
      '/tools/base64': t('tools.base64.name'),
      '/tools/crypto': t('tools.crypto.name'),
      '/tools/image-compressor': t('tools.imageCompressor.name'),
      '/about': t('nav.about'),
      '/privacy': t('footer.privacy'),
      '/terms': t('footer.terms'),
      '/gantt-guide': t('ganttGuide.title'),
      '/faq': t('faq.title'),
    };

    // 页面描述映射
    const pathDescriptionMap: Record<string, string> = {
      '/': baseDescription,
      '/tools/gantt': t('tools.gantt.description'),
      '/tools/json-parser': t('tools.jsonParser.description'),
      '/tools/base64': t('tools.base64.description'),
      '/tools/crypto': t('tools.crypto.description'),
      '/tools/image-compressor': t('tools.imageCompressor.description'),
      '/about': t('about.description'),
      '/privacy': t('privacy.metaDescription'),
      '/terms': t('terms.metaDescription'),
      '/gantt-guide': t('ganttGuide.description'),
      '/faq': t('faq.subtitle'),
    };

    // 设置页面标题
    const pageTitle = pathTitleMap[location.pathname];
    document.title = location.pathname === '/' 
      ? baseTitle 
      : pageTitle 
        ? `${pageTitle} - ${baseTitle}`
        : baseTitle;

    // 设置 meta description
    const description = pathDescriptionMap[location.pathname] || baseDescription;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // 设置 Open Graph 标签
    const ogTitle = document.title;
    const ogDescription = description;
    const ogUrl = `https://ganttleman.com${location.pathname}`;

    // OG Title
    let ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (!ogTitleTag) {
      ogTitleTag = document.createElement('meta');
      ogTitleTag.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitleTag);
    }
    ogTitleTag.setAttribute('content', ogTitle);

    // OG Description
    let ogDescTag = document.querySelector('meta[property="og:description"]');
    if (!ogDescTag) {
      ogDescTag = document.createElement('meta');
      ogDescTag.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescTag);
    }
    ogDescTag.setAttribute('content', ogDescription);

    // OG URL
    let ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (!ogUrlTag) {
      ogUrlTag = document.createElement('meta');
      ogUrlTag.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrlTag);
    }
    ogUrlTag.setAttribute('content', ogUrl);

    // OG Type
    let ogTypeTag = document.querySelector('meta[property="og:type"]');
    if (!ogTypeTag) {
      ogTypeTag = document.createElement('meta');
      ogTypeTag.setAttribute('property', 'og:type');
      document.head.appendChild(ogTypeTag);
    }
    ogTypeTag.setAttribute('content', 'website');

    // 添加 hreflang 标签（告诉搜索引擎多语言版本）
    const langPathMap: Record<string, string> = {
      'en': 'en',
      'zh-TW': 'zh-tw',
      'zh-CN': 'zh-cn',
      'ja': 'ja',
      'ko': 'ko',
      'es': 'es',
    };
    
    // 从当前路径中移除语言前缀，获取基础路径
    const pathMatch = location.pathname.match(/^\/[^/]+(.*)$/);
    const basePath = pathMatch ? pathMatch[1] || '/' : '/';
    
    // 移除旧的 hreflang 标签
    document.querySelectorAll('link[rel="alternate"]').forEach(link => link.remove());
    
    // 为每种语言添加 hreflang 标签
    Object.entries(langPathMap).forEach(([langCode, langPath]) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', langCode);
      link.setAttribute('href', `https://ganttleman.com/${langPath}${basePath}`);
      document.head.appendChild(link);
    });

    // 添加 x-default（用于未匹配的语言，指向英文版）
    const xDefaultLink = document.createElement('link');
    xDefaultLink.setAttribute('rel', 'alternate');
    xDefaultLink.setAttribute('hreflang', 'x-default');
    xDefaultLink.setAttribute('href', `https://ganttleman.com/en${basePath}`);
    document.head.appendChild(xDefaultLink);

  }, [location.pathname, t, i18n.language]);

  return null;
}

// 语言路由组件 - 包含所有页面的路由配置
function LanguageRoutes() {
  return (
    <Routes>
      <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
      <Route path="/tools/gantt" element={<GanttPage />} />
      <Route path="/tools/json-parser" element={<><Navbar /><JsonParserPage /><Footer /></>} />
      <Route path="/tools/base64" element={<><Navbar /><Base64Page /><Footer /></>} />
      <Route path="/tools/crypto" element={<><Navbar /><CryptoPage /><Footer /></>} />
      <Route path="/tools/image-compressor" element={<><Navbar /><ImageCompressorPage /><Footer /></>} />
      <Route path="/about" element={<><Navbar /><AboutPage /><Footer /></>} />
      <Route path="/privacy" element={<><Navbar /><PrivacyPage /><Footer /></>} />
      <Route path="/terms" element={<><Navbar /><TermsPage /><Footer /></>} />
      <Route path="/gantt-guide" element={<><Navbar /><GanttGuidePage /><Footer /></>} />
      <Route path="/faq" element={<><Navbar /><FAQPage /><Footer /></>} />
    </Routes>
  );
}

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
          <DocumentTitle />
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Routes>
              {/* 根路径重定向到用户首选语言 */}
              <Route path="/" element={<RootRedirect />} />
              
              {/* 所有语言版本的路由 */}
              <Route path="/:lang/*" element={<LanguageRouter><LanguageRoutes /></LanguageRouter>} />
              
              {/* 旧路径重定向（兼容性） */}
              <Route path="/tools/gantt" element={<Navigate to="/en/tools/gantt" replace />} />
              <Route path="/tools/json-parser" element={<Navigate to="/en/tools/json-parser" replace />} />
              <Route path="/tools/base64" element={<Navigate to="/en/tools/base64" replace />} />
              <Route path="/tools/crypto" element={<Navigate to="/en/tools/crypto" replace />} />
              <Route path="/tools/image-compressor" element={<Navigate to="/en/tools/image-compressor" replace />} />
              <Route path="/about" element={<Navigate to="/en/about" replace />} />
              <Route path="/privacy" element={<Navigate to="/en/privacy" replace />} />
              <Route path="/terms" element={<Navigate to="/en/terms" replace />} />
            </Routes>
          </Box>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;

