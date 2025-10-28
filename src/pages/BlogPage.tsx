import { Container, Box, Typography, Grid, Card, CardContent, CardActionArea, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  color: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: '為什麼專案管理需要甘特圖？完整指南',
    excerpt: '甘特圖是專案管理中最常用的視覺化工具之一。它能夠清楚地展示任務時程、資源分配和專案進度。本文將深入探討甘特圖的優勢、使用場景，以及如何有效運用甘特圖來提升團隊協作效率。',
    date: '2024-10-20',
    readTime: '5 分鐘',
    category: '專案管理',
    color: '#6750A4',
  },
  {
    id: '2',
    title: 'JSON 格式化的最佳實踐：開發者必知技巧',
    excerpt: 'JSON 是現代 Web 開發中最常用的資料交換格式。正確的格式化不僅能提升程式碼可讀性，還能幫助快速發現錯誤。本文分享 JSON 格式化的最佳實踐，包括縮排、命名規範、以及常見錯誤排除技巧。',
    date: '2024-10-18',
    readTime: '4 分鐘',
    category: '開發技巧',
    color: '#2196F3',
  },
  {
    id: '3',
    title: 'Base64 編碼詳解：原理、應用與實戰',
    excerpt: 'Base64 是一種將二進位資料編碼為文字的方式，廣泛應用於網頁開發、資料傳輸等場景。本文將深入淺出地介紹 Base64 的編碼原理、常見應用場景，以及在實際開發中的使用技巧和注意事項。',
    date: '2024-10-15',
    readTime: '6 分鐘',
    category: '技術原理',
    color: '#4CAF50',
  },
  {
    id: '4',
    title: '圖片壓縮技術解析：如何在保持畫質下減少檔案大小',
    excerpt: '網站效能優化的關鍵之一就是圖片壓縮。本文將介紹各種圖片壓縮技術的原理，比較有損壓縮與無損壓縮的差異，並分享如何選擇合適的壓縮率來平衡檔案大小與畫質的實用建議。',
    date: '2024-10-12',
    readTime: '5 分鐘',
    category: '效能優化',
    color: '#FF9800',
  },
  {
    id: '5',
    title: '提升工作效率的 10 個免費線上工具推薦',
    excerpt: '在數位化辦公的時代，善用工具能大幅提升工作效率。本文精選 10 個實用的免費線上工具，涵蓋專案管理、檔案轉換、圖片處理、程式開發等各個面向，幫助你更聰明地工作。',
    date: '2024-10-10',
    readTime: '8 分鐘',
    category: '工具推薦',
    color: '#9C27B0',
  },
  {
    id: '6',
    title: '遠端協作必備：如何使用甘特圖管理分散式團隊',
    excerpt: '遠端工作已成為新常態，如何有效管理分散在各地的團隊成員是一大挑戰。本文分享如何運用甘特圖工具來協調遠端團隊的工作，確保專案進度透明化，提升團隊協作效率。',
    date: '2024-10-08',
    readTime: '6 分鐘',
    category: '遠端協作',
    color: '#E91E63',
  },
];

export default function BlogPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          📚 實用文章
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
          分享工具使用技巧、效率提升方法和實用知識
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {blogPosts.map((post) => (
          <Grid item xs={12} md={6} key={post.id}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                },
              }}
            >
              <CardActionArea
                onClick={() => navigate(`/blog/${post.id}`)}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <CardContent sx={{ flexGrow: 1, width: '100%' }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={post.category}
                      size="small"
                      sx={{
                        backgroundColor: post.color + '20',
                        color: post.color,
                        fontWeight: 600,
                      }}
                    />
                    <Chip
                      label={post.readTime}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                    {post.excerpt}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    發布於 {new Date(post.date).toLocaleDateString('zh-TW')}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center', p: 4, backgroundColor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          想要了解更多？
        </Typography>
        <Typography variant="body1" color="text.secondary">
          我們會定期發布新文章，分享實用技巧和工具使用心得
        </Typography>
      </Box>
    </Container>
  );
}

