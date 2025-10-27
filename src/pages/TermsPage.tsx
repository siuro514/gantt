import { Container, Box, Typography, Paper } from '@mui/material';

export default function TermsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
          使用條款
        </Typography>

        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 4 }}>
          最後更新：{new Date().toLocaleDateString('zh-TW')}
        </Typography>

        <Box sx={{ '& > *': { mb: 3 } }}>
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              1. 服務說明
            </Typography>
            <Typography variant="body1" paragraph>
              Eazy & Good Things 提供免費的在線工具集合，包括但不限於甘特圖、JSON 格式化、Base64 編解碼、圖片壓縮等功能。
              所有工具均可免費使用，無需註冊。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              2. 使用授權
            </Typography>
            <Typography variant="body1" paragraph>
              我們授予您有限的、非獨占的、不可轉讓的權利來使用本網站的服務。
              您同意僅將本服務用於合法目的，且不會以任何方式濫用本服務。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              3. 使用限制
            </Typography>
            <Typography variant="body1" paragraph>
              您同意不會：
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" variant="body1" paragraph>
                試圖破壞或干擾網站的正常運作
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                使用自動化工具過度訪問網站
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                複製、修改或分發網站的任何部分（除非獲得明確授權）
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                將服務用於任何非法或未經授權的目的
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              4. 免責聲明
            </Typography>
            <Typography variant="body1" paragraph>
              本服務按「現狀」提供，不提供任何明示或暗示的保證。我們不保證服務將不間斷、及時、安全或無錯誤。
              使用本服務產生的任何資料遺失、錯誤或損害，我們概不負責。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              5. 責任限制
            </Typography>
            <Typography variant="body1" paragraph>
              在法律允許的最大範圍內，Eazy & Good Things 及其開發者不對任何直接、間接、偶然、特殊或後果性損害承擔責任。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              6. 知識產權
            </Typography>
            <Typography variant="body1" paragraph>
              本網站的所有內容，包括但不限於文字、圖形、標誌、圖示、圖像和軟體，均受版權法和其他知識產權法的保護。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              7. 第三方連結
            </Typography>
            <Typography variant="body1" paragraph>
              本網站可能包含指向第三方網站的連結。我們不對這些網站的內容或做法負責。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              8. 條款修改
            </Typography>
            <Typography variant="body1" paragraph>
              我們保留隨時修改這些條款的權利。繼續使用本服務即表示您接受修改後的條款。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              9. 適用法律
            </Typography>
            <Typography variant="body1" paragraph>
              本條款受中華民國法律管轄，任何爭議應提交台灣法院管轄。
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              10. 聯絡資訊
            </Typography>
            <Typography variant="body1">
              如有任何問題或疑慮，請聯絡我們：
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

