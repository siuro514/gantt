import { Container, Box, Typography, Grid } from '@mui/material';
import { tools } from '@/data/tools';
import ToolCard from '@/components/ToolCard';
import ThemeColorPicker from '@/components/ThemeColorPicker';
import BoltIcon from '@mui/icons-material/Bolt';
import AdjustIcon from '@mui/icons-material/Adjust';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import SecurityIcon from '@mui/icons-material/Security';

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 50%, #4a4a4a 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(192, 192, 192, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '30%',
            left: '10%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        
        <Container maxWidth="lg">
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', pt: { xs: 8, md: 10 } }}>
            {/* Logo and Title */}
            <Box sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              gap: 2,
              animation: 'fadeInDown 0.8s ease-out',
              '@keyframes fadeInDown': {
                from: {
                  opacity: 0,
                  transform: 'translateY(-20px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 60, md: 80 },
                height: { xs: 60, md: 80 },
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(255, 215, 0, 0.15) 100%)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2), 0 0 20px rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': {
                    transform: 'translateY(0px)',
                  },
                  '50%': {
                    transform: 'translateY(-12px)',
                  },
                },
              }}>
                <BoltIcon sx={{ fontSize: { xs: '2.4rem', md: '3.6rem' }, color: '#d4af37' }} />
              </Box>
            </Box>
            
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontFamily: '"Inter", "Noto Sans TC", -apple-system, sans-serif',
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 2,
                letterSpacing: { xs: '-0.03em', md: '-0.04em' },
                textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                animation: 'fadeIn 1s ease-out',
                lineHeight: 1.1,
                '@keyframes fadeIn': {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              }}
            >
              Easy & Good Things
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                mb: 5,
                fontWeight: 500,
                fontFamily: '"Noto Sans TC", "Inter", -apple-system, sans-serif',
                opacity: 0.95,
                fontSize: { xs: '1.1rem', md: '1.4rem' },
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.7,
                letterSpacing: '0.02em',
              }}
            >
              你的效率助手 · 免費在線工具集合
            </Typography>
            
            {/* Feature Tags */}
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 2, md: 3 }, 
              justifyContent: 'center', 
              flexWrap: 'wrap',
              mt: 5,
            }}>
              {[
                { icon: <BoltIcon />, text: '快速' },
                { icon: <AdjustIcon />, text: '簡單' },
                { icon: <CardGiftcardIcon />, text: '免費' },
                { icon: <SecurityIcon />, text: '安全' },
              ].map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      background: 'rgba(212, 175, 55, 0.15)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(212, 175, 55, 0.2)',
                      borderColor: 'rgba(212, 175, 55, 0.5)',
                    },
                  }}
                >
                  {feature.icon}
                  <Typography variant="body1" sx={{ 
                    fontWeight: 600,
                    fontFamily: '"Noto Sans TC", "Inter", -apple-system, sans-serif',
                    letterSpacing: '0.03em',
                  }}>
                    {feature.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Tools Section */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ 
            fontWeight: 700,
            fontFamily: '"Noto Sans TC", "Inter", -apple-system, sans-serif',
            letterSpacing: '-0.01em',
          }}>
            精選工具
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ 
            maxWidth: 600, 
            mx: 'auto',
            lineHeight: 1.8,
            fontFamily: '"Noto Sans TC", -apple-system, sans-serif',
          }}>
            我們提供一系列實用的在線工具，幫助你提升工作效率。
            所有工具完全免費，無需註冊，在瀏覽器中即可使用。
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {tools.map((tool) => (
            <Grid item xs={12} sm={6} md={6} key={tool.id}>
              <ToolCard tool={tool} />
            </Grid>
          ))}
        </Grid>

        {/* Feature Highlights */}
        <Box sx={{ mt: 10, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ 
            fontWeight: 700, 
            mb: 4,
            fontFamily: '"Noto Sans TC", "Inter", -apple-system, sans-serif',
            letterSpacing: '-0.01em',
          }}>
            為什麼選擇 Easy & Good Things？
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'inline-flex', 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: '#E8F4FD', 
                  color: '#2196F3',
                  mb: 2 
                }}>
                  <BoltIcon sx={{ fontSize: '3rem' }} />
                </Box>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600,
                  fontFamily: '"Noto Sans TC", -apple-system, sans-serif',
                  letterSpacing: '0.01em',
                }}>
                  快速啟動
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  lineHeight: 1.7,
                  fontFamily: '"Noto Sans TC", -apple-system, sans-serif',
                }}>
                  無需安裝任何軟體，打開瀏覽器即可使用
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'inline-flex', 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: '#E8F5E9', 
                  color: '#4CAF50',
                  mb: 2 
                }}>
                  <SecurityIcon sx={{ fontSize: '3rem' }} />
                </Box>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600,
                  fontFamily: '"Noto Sans TC", -apple-system, sans-serif',
                  letterSpacing: '0.01em',
                }}>
                  隱私安全
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  lineHeight: 1.7,
                  fontFamily: '"Noto Sans TC", -apple-system, sans-serif',
                }}>
                  所有處理都在本地完成，不會上傳你的資料
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'inline-flex', 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: '#FFF3E0', 
                  color: '#FF9800',
                  mb: 2 
                }}>
                  <AdjustIcon sx={{ fontSize: '3rem' }} />
                </Box>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600,
                  fontFamily: '"Noto Sans TC", -apple-system, sans-serif',
                  letterSpacing: '0.01em',
                }}>
                  簡單易用
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  lineHeight: 1.7,
                  fontFamily: '"Noto Sans TC", -apple-system, sans-serif',
                }}>
                  清晰的介面設計，無需學習即可上手
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ p: 3 }}>
                <Box sx={{ 
                  display: 'inline-flex', 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: '#F3E5F5', 
                  color: '#9C27B0',
                  mb: 2 
                }}>
                  <CardGiftcardIcon sx={{ fontSize: '3rem' }} />
                </Box>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600,
                  fontFamily: '"Noto Sans TC", -apple-system, sans-serif',
                  letterSpacing: '0.01em',
                }}>
                  完全免費
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{
                  lineHeight: 1.7,
                  fontFamily: '"Noto Sans TC", -apple-system, sans-serif',
                }}>
                  所有功能永久免費，無需註冊或付費
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* 浮動主題顏色選擇器 */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <ThemeColorPicker />
      </Box>
    </Box>
  );
}

