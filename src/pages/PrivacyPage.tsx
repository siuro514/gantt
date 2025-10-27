import { Container, Box, Typography, Paper } from '@mui/material';

export default function PrivacyPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
          隱私政策
        </Typography>

        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 4 }}>
          最後更新：{new Date().toLocaleDateString('zh-TW')}
        </Typography>

        <Box sx={{ '& > *': { mb: 3 } }}>
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              1. 資料收集
            </Typography>
            <Typography variant="body1" paragraph>
              Easy & Good Things 致力於保護您的隱私。我們的所有工具都在您的瀏覽器本地運行，不會將您的資料上傳到我們的伺服器。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              2. 本地儲存
            </Typography>
            <Typography variant="body1" paragraph>
              部分工具（如甘特圖）會使用瀏覽器的 LocalStorage 功能來儲存您的資料，以便您下次訪問時可以繼續使用。
              這些資料僅儲存在您的設備上，我們無法訪問。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              3. Cookies 與追蹤
            </Typography>
            <Typography variant="body1" paragraph>
              我們使用 Google Analytics 來了解網站的使用情況，以及 Google AdSense 來顯示廣告。
              這些服務可能會使用 Cookies 來收集匿名的使用統計資料。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              4. 第三方服務
            </Typography>
            <Typography variant="body1" paragraph>
              我們的網站使用以下第三方服務：
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" variant="body1" paragraph>
                Google AdSense - 用於顯示廣告
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Google Analytics - 用於分析網站流量
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              這些服務有各自的隱私政策，我們建議您查閱相關說明。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              5. 資料安全
            </Typography>
            <Typography variant="body1" paragraph>
              由於我們不收集或儲存您的個人資料，因此不存在資料洩露的風險。
              所有處理都在您的瀏覽器本地完成。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              6. 兒童隱私
            </Typography>
            <Typography variant="body1" paragraph>
              我們的服務面向一般大眾，不會故意收集 13 歲以下兒童的個人資訊。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              7. 政策變更
            </Typography>
            <Typography variant="body1" paragraph>
              我們可能會不時更新本隱私政策。任何變更都會在本頁面上發布，並更新「最後更新」日期。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              8. 聯絡我們
            </Typography>
            <Typography variant="body1">
              如果您對本隱私政策有任何疑問，請透過電子郵件聯絡我們：
              <Typography component="a" href="mailto:ezgoodthings@gmail.com" sx={{ ml: 1, color: 'primary.main' }}>
                ezgoodthings@gmail.com
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

