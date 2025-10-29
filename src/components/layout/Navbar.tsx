import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import BoltIcon from '@mui/icons-material/Bolt';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

interface NavbarProps {
  customColor?: string;
  onOffsetChange?: (offset: number) => void;
}

export default function Navbar({ customColor, onOffsetChange }: NavbarProps = {}) {
  const { t } = useTranslation();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [navbarOffset, setNavbarOffset] = useState(0);

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      // Check if scrolled past the hero section
      setScrolled(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // 监听整个页面的滚动，控制 Navbar 偏移
  useEffect(() => {
    if (!customColor) return;

    const NAVBAR_HEIGHT = 64;
    let currentNavbarOffset = 0;

    const handleWheel = (e: WheelEvent) => {
      const ganttScrollContainer = document.getElementById('gantt-scroll-container');
      if (!ganttScrollContainer) return;

      const deltaY = e.deltaY;
      const currentScroll = ganttScrollContainer.scrollTop;
      
      // 向下滚动
      if (deltaY > 0) {
        if (currentNavbarOffset < NAVBAR_HEIGHT) {
          // Navbar 还没完全隐藏，先移动 navbar
          e.preventDefault();
          currentNavbarOffset = Math.min(currentNavbarOffset + deltaY, NAVBAR_HEIGHT);
          setNavbarOffset(currentNavbarOffset);
          onOffsetChange?.(currentNavbarOffset);
        }
        // 如果 navbar 已完全隐藏，允许容器正常滚动
      }
      // 向上滚动
      else if (deltaY < 0) {
        if (currentScroll <= 0 && currentNavbarOffset > 0) {
          // 容器已滚动到顶部，且 navbar 还是隐藏的，先显示 navbar
          e.preventDefault();
          currentNavbarOffset = Math.max(currentNavbarOffset + deltaY, 0);
          setNavbarOffset(currentNavbarOffset);
          onOffsetChange?.(currentNavbarOffset);
        }
        // 如果容器还有内容可滚动，允许正常滚动
      }
    };

    // 监听整个页面的 wheel 事件
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [customColor, onOffsetChange]);

  // Determine if we should use light text (on hero section) or dark text (scrolled on white bg)
  const useLightText = customColor ? true : (isHomePage && !scrolled);
  const useCustomColor = !!customColor;

  return (
    <AppBar 
      position={(isHomePage || useCustomColor) ? 'fixed' : 'sticky'}
      elevation={0} 
      sx={{ 
        backgroundColor: useCustomColor
          ? 'rgba(58, 58, 58, 0.85)' // 铁灰色系毛玻璃背景
          : (useLightText 
            ? 'rgba(42, 42, 42, 0.6)' 
            : 'rgba(255, 255, 255, 0.9)'),
        backdropFilter: 'blur(20px)',
        borderBottom: useCustomColor
          ? `1px solid ${customColor}40` // 使用主题色作为边框，40 为透明度
          : (useLightText 
            ? '1px solid rgba(212, 175, 55, 0.2)' 
            : '1px solid rgba(0, 0, 0, 0.08)'),
        transform: useCustomColor ? `translateY(-${navbarOffset + (navbarOffset > 0 ? 1 : 0)}px)` : 'none',
        transition: 'background-color 0.3s ease, border-bottom 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: '70px', py: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: 2,
                background: useCustomColor
                  ? `linear-gradient(135deg, ${customColor}30 0%, ${customColor}20 100%)`
                  : (useLightText 
                    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(255, 215, 0, 0.15) 100%)' 
                    : 'linear-gradient(135deg, #3a3a3a 0%, #4a4a4a 100%)'),
                backdropFilter: 'blur(10px)',
                boxShadow: useCustomColor
                  ? `0 4px 14px ${customColor}40`
                  : (useLightText 
                    ? '0 4px 14px rgba(212, 175, 55, 0.2)' 
                    : '0 4px 14px rgba(0, 0, 0, 0.3)'),
                border: useCustomColor
                  ? `1px solid ${customColor}60`
                  : (useLightText 
                    ? '1px solid rgba(212, 175, 55, 0.3)' 
                    : '1px solid rgba(212, 175, 55, 0.5)'),
                transition: 'all 0.3s ease',
              }}>
                <BoltIcon sx={{ 
                  color: useCustomColor ? customColor : '#d4af37', 
                  fontSize: '1rem' 
                }} />
              </Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                fontFamily: '"Inter", "Noto Sans TC", -apple-system, sans-serif',
                color: useLightText ? 'white' : 'text.primary',
                fontSize: '1.25rem',
                letterSpacing: '-0.03em',
                textShadow: useLightText ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
                transition: 'all 0.3s ease',
              }}>
                {t('site.title')}
              </Typography>
            </Box>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            alignItems: 'center',
            color: useLightText ? 'white' : 'text.primary',
            transition: 'all 0.3s ease',
          }}>
            <Button 
              component={Link} 
              to="/about" 
              sx={{ 
                color: 'inherit',
                fontWeight: 500,
                px: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: useCustomColor
                    ? `${customColor}20`
                    : (useLightText 
                      ? 'rgba(212, 175, 55, 0.15)' 
                      : 'rgba(212, 175, 55, 0.08)'),
                },
              }}
            >
              {t('nav.about')}
            </Button>
            <LanguageSwitcher />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

