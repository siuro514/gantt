import { Container, Box, Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function TermsPage() {
  const { t, i18n } = useTranslation();
  
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
          {t('terms.title')}
        </Typography>

        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 4 }}>
          {t('terms.lastUpdated')}：{new Date().toLocaleDateString(i18n.language)}
        </Typography>

        <Box sx={{ '& > *': { mb: 3 } }}>
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              1. {t('terms.section1.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.section1.content')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              2. {t('terms.section2.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.section2.content')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              3. {t('terms.section3.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.section3.intro')}
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" variant="body1" paragraph>
                {t('terms.section3.item1')}
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                {t('terms.section3.item2')}
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                {t('terms.section3.item3')}
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                {t('terms.section3.item4')}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              4. {t('terms.section4.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.section4.content')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              5. {t('terms.section5.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.section5.content')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              6. {t('terms.section6.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.section6.content')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              7. {t('terms.section7.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.section7.content')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              8. {t('terms.section8.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.section8.content')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              9. {t('terms.section9.title')}
            </Typography>
            <Typography variant="body1" paragraph>
              {t('terms.section9.content')}
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              10. {t('terms.section10.title')}
            </Typography>
            <Typography variant="body1">
              {t('terms.section10.content')}
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
