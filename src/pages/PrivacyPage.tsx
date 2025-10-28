import { Container, Box, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function PrivacyPage() {
  const { t, i18n } = useTranslation();
  
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
          {t('privacy.title')}
        </Typography>

        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 4 }}>
          {t('privacy.lastUpdated')}：{new Date().toLocaleDateString(i18n.language)}
        </Typography>

        <Box sx={{ '& > *': { mb: 3 } }}>
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              1. {t('privacy.section1.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('privacy.section1.content')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              2. {t('privacy.section2.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('privacy.section2.content')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              3. {t('privacy.section3.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('privacy.section3.content')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              4. {t('privacy.section4.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('privacy.section4.intro')}
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" variant="body1" paragraph>
                {t('privacy.section4.item1')}
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                {t('privacy.section4.item2')}
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              {t('privacy.section4.outro')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              5. {t('privacy.section5.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('privacy.section5.content')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              6. {t('privacy.section6.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('privacy.section6.content')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              7. {t('privacy.section7.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('privacy.section7.content')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              8. {t('privacy.section8.title')}
            </Typography>
            <Typography variant="body1">
              {t('privacy.section8.content')}
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

