import { Container, Box, Typography, Grid } from '@mui/material';
import { tools } from '@/data/tools';
import ToolCard from '@/components/ToolCard';

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              ⚡ Easy & Good Things
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 300,
                opacity: 0.95,
                fontSize: { xs: '1.2rem', md: '1.5rem' },
              }}
            >
              你的效率助手，免費在線工具集合
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  ⚡ 快速
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  · 🎯 簡單
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  · 🆓 免費
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  · 🔒 安全
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Tools Section */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            精選工具
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
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
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
            為什麼選擇 Easy & Good Things？
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h3" sx={{ mb: 1 }}>⚡</Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  快速啟動
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  無需安裝任何軟體，打開瀏覽器即可使用
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h3" sx={{ mb: 1 }}>🔒</Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  隱私安全
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  所有處理都在本地完成，不會上傳你的資料
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h3" sx={{ mb: 1 }}>🎯</Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  簡單易用
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  清晰的介面設計，無需學習即可上手
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h3" sx={{ mb: 1 }}>🆓</Typography>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  完全免費
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  所有功能永久免費，無需註冊或付費
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

