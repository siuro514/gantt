import { Container, Box, Typography, Paper, Grid } from '@mui/material';

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          關於 Eazy & Good Things
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
          我們致力於打造最實用的免費在線工具集合
        </Typography>
      </Box>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          我們的使命
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          在這個數位化的時代，我們每天都需要處理各種不同的任務：格式化程式碼、編碼解碼資料、壓縮圖片、管理專案進度等等。
          雖然市面上有許多工具可以完成這些任務，但它們往往需要下載安裝、註冊帳號，或是需要付費使用。
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          Eazy & Good Things 的誕生，就是為了解決這個問題。我們提供完全免費、無需註冊、開箱即用的在線工具集合。
          所有工具都在瀏覽器本地運行，確保您的資料安全和隱私。
        </Typography>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              🎯 我們的核心價值
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" paragraph>
                <strong>簡單易用：</strong>清晰的介面設計，無需學習即可上手
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>完全免費：</strong>所有功能永久免費，沒有隱藏費用
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>隱私優先：</strong>所有處理都在本地完成，保護您的資料安全
              </Typography>
              <Typography component="li" variant="body1">
                <strong>持續更新：</strong>我們會不斷添加新工具，改進現有功能
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              💡 為什麼選擇 Eazy & Good Things？
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" paragraph>
                無需安裝任何軟體，打開瀏覽器即可使用
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                不需要註冊帳號或提供個人資訊
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                跨平台支援：Windows、Mac、Linux、行動裝置都能使用
              </Typography>
              <Typography component="li" variant="body1">
                快速載入，流暢運行，提供最佳使用體驗
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 4, backgroundColor: 'primary.50' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          我們的工具
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          目前我們提供四大類實用工具：
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>📊 專案管理</Typography>
              <Typography variant="body2" color="text.secondary">
                人力資源甘特圖，幫助團隊視覺化管理任務和時程
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>📝 開發工具</Typography>
              <Typography variant="body2" color="text.secondary">
                JSON 格式化工具，讓資料結構更清晰易讀
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>🔐 編碼工具</Typography>
              <Typography variant="body2" color="text.secondary">
                Base64 編解碼，快速轉換文字和資料格式
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>🖼️ 圖片處理</Typography>
              <Typography variant="body2" color="text.secondary">
                圖片壓縮工具，減少檔案大小並保持畫質
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mt: 3 }}>
          我們會持續開發更多實用工具，敬請期待！
        </Typography>
      </Paper>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          聯絡我們
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          如有任何建議、問題或合作機會，歡迎與我們聯繫
        </Typography>
        <Typography variant="body1">
          Email: 
          <Typography component="a" href="mailto:ezgoodthings@gmail.com" sx={{ ml: 1, color: 'primary.main' }}>
            ezgoodthings@gmail.com
          </Typography>
        </Typography>
      </Box>
    </Container>
  );
}

