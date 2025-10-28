import { Box, Container, Typography, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

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
            ⚡ {t('site.title')} - {t('footer.tagline')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('footer.description')}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Link href="/about" color="text.secondary" sx={{ mx: 1, fontSize: '0.875rem' }}>
              {t('footer.links.about')}
            </Link>
            <Link href="/privacy" color="text.secondary" sx={{ mx: 1, fontSize: '0.875rem' }}>
              {t('footer.links.privacy')}
            </Link>
            <Link href="/terms" color="text.secondary" sx={{ mx: 1, fontSize: '0.875rem' }}>
              {t('footer.links.terms')}
            </Link>
            <Link href="mailto:ezgoodthings@gmail.com" color="text.secondary" sx={{ mx: 1, fontSize: '0.875rem' }}>
              {t('footer.links.contact')}
            </Link>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            {t('footer.copyright', { year: currentYear })}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

