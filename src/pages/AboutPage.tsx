import { Container, Box, Typography, Paper, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          {t('about.title')}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
          {t('about.subtitle')}
        </Typography>
      </Box>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          {t('about.mission.title')}
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          {t('about.mission.p1')}
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          {t('about.mission.p2')}
        </Typography>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              🎯 {t('about.values.title')}
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" paragraph>
                <strong>{t('about.values.simple.title')}：</strong>{t('about.values.simple.description')}
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>{t('about.values.free.title')}：</strong>{t('about.values.free.description')}
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>{t('about.values.privacy.title')}：</strong>{t('about.values.privacy.description')}
              </Typography>
              <Typography component="li" variant="body1">
                <strong>{t('about.values.update.title')}：</strong>{t('about.values.update.description')}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              💡 {t('about.why.title')}
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1" paragraph>
                {t('about.why.reason1')}
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                {t('about.why.reason2')}
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                {t('about.why.reason3')}
              </Typography>
              <Typography component="li" variant="body1">
                {t('about.why.reason4')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          {t('about.contact.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {t('about.contact.description')}
        </Typography>
        <Typography variant="body1">
          {t('about.contact.email')}: 
          <Typography component="a" href="mailto:ezgoodthings@gmail.com" sx={{ ml: 1, color: 'primary.main' }}>
            ezgoodthings@gmail.com
          </Typography>
        </Typography>
      </Box>
    </Container>
  );
}

