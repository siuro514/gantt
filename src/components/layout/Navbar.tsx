import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import BoltIcon from '@mui/icons-material/Bolt';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      // Check if scrolled past the hero section
      setScrolled(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Determine if we should use light text (on hero section) or dark text (scrolled on white bg)
  const useLightText = isHomePage && !scrolled;

  return (
    <AppBar 
      position={isHomePage ? 'fixed' : 'sticky'}
      elevation={0} 
      sx={{ 
        backgroundColor: useLightText 
          ? 'rgba(42, 42, 42, 0.6)' 
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: useLightText 
          ? '1px solid rgba(212, 175, 55, 0.2)' 
          : '1px solid rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
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
                background: useLightText 
                  ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(255, 215, 0, 0.15) 100%)' 
                  : 'linear-gradient(135deg, #3a3a3a 0%, #4a4a4a 100%)',
                backdropFilter: 'blur(10px)',
                boxShadow: useLightText 
                  ? '0 4px 14px rgba(212, 175, 55, 0.2)' 
                  : '0 4px 14px rgba(0, 0, 0, 0.3)',
                border: useLightText 
                  ? '1px solid rgba(212, 175, 55, 0.3)' 
                  : '1px solid rgba(212, 175, 55, 0.5)',
                transition: 'all 0.3s ease',
              }}>
                <BoltIcon sx={{ 
                  color: useLightText ? '#d4af37' : '#d4af37', 
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
                Easy & Good Things
              </Typography>
            </Box>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              component={Link} 
              to="/about" 
              sx={{ 
                color: useLightText ? 'white' : 'text.primary',
                fontWeight: 500,
                px: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: useLightText 
                    ? 'rgba(212, 175, 55, 0.15)' 
                    : 'rgba(212, 175, 55, 0.08)',
                },
              }}
            >
              關於
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

