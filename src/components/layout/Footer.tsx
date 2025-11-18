import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { LANG_CODE_TO_PATH } from '../LanguageRouter';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentYear = new Date().getFullYear();
  
  // 获取当前语言路径前缀
  const langPrefix = `/${lang || LANG_CODE_TO_PATH[i18n.language] || 'en'}`;

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
            <Link to={langPrefix + '/about'} style={{ color: 'inherit', textDecoration: 'none', margin: '0 8px', fontSize: '0.875rem' }}>
              {t('footer.links.about')}
            </Link>
            <Link to={langPrefix + '/gantt-guide'} style={{ color: 'inherit', textDecoration: 'none', margin: '0 8px', fontSize: '0.875rem' }}>
              {t('ganttGuide.title')}
            </Link>
            <Link to={langPrefix + '/faq'} style={{ color: 'inherit', textDecoration: 'none', margin: '0 8px', fontSize: '0.875rem' }}>
              {t('faq.title')}
            </Link>
            <Link to={langPrefix + '/privacy'} style={{ color: 'inherit', textDecoration: 'none', margin: '0 8px', fontSize: '0.875rem' }}>
              {t('footer.links.privacy')}
            </Link>
            <Link to={langPrefix + '/terms'} style={{ color: 'inherit', textDecoration: 'none', margin: '0 8px', fontSize: '0.875rem' }}>
              {t('footer.links.terms')}
            </Link>
            <MuiLink href="mailto:ezgoodthings@gmail.com" color="text.secondary" sx={{ mx: 1, fontSize: '0.875rem' }}>
              {t('footer.links.contact')}
            </MuiLink>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            {t('footer.copyright', { year: currentYear })}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

