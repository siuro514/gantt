import { Box, Container, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            ⚡ Easy & Good Things - 你的效率助手
          </Typography>
          <Typography variant="body2" color="text.secondary">
            免費在線工具集合 · 無需註冊 · 開箱即用
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Link href="/about" color="text.secondary" sx={{ mx: 1, fontSize: '0.875rem' }}>
              關於
            </Link>
            <Link href="/privacy" color="text.secondary" sx={{ mx: 1, fontSize: '0.875rem' }}>
              隱私政策
            </Link>
            <Link href="/terms" color="text.secondary" sx={{ mx: 1, fontSize: '0.875rem' }}>
              使用條款
            </Link>
            <Link href="mailto:ezgoodthings@gmail.com" color="text.secondary" sx={{ mx: 1, fontSize: '0.875rem' }}>
              聯絡我們
            </Link>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            © {new Date().getFullYear()} Easy & Good Things. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

