import { Container, Box, Typography, Paper, Grid, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

export default function GanttGuidePage() {
  const { t } = useTranslation();

  const Feature = ({ title, description }: { title: string; description: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
      <CheckCircleIcon sx={{ color: 'primary.main', mr: 1.5, mt: 0.5, flexShrink: 0 }} />
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
  );

  const Tip = ({ content }: { content: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
      <TipsAndUpdatesIcon sx={{ color: 'warning.main', mr: 1.5, mt: 0.3, fontSize: '1.2rem' }} />
      <Typography variant="body2" color="text.secondary">
        {content}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          {t('ganttGuide.title')}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
          {t('ganttGuide.subtitle')}
        </Typography>
      </Box>

      {/* 什麼是甘特圖 */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          {t('ganttGuide.whatIs.title')}
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          {t('ganttGuide.whatIs.p1')}
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          {t('ganttGuide.whatIs.p2')}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          {t('ganttGuide.whatIs.p3')}
        </Typography>
      </Paper>

      {/* 主要功能 */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          {t('ganttGuide.features.title')}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Feature
              title={t('ganttGuide.features.drag.title')}
              description={t('ganttGuide.features.drag.description')}
            />
            <Feature
              title={t('ganttGuide.features.sprint.title')}
              description={t('ganttGuide.features.sprint.description')}
            />
            <Feature
              title={t('ganttGuide.features.member.title')}
              description={t('ganttGuide.features.member.description')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Feature
              title={t('ganttGuide.features.color.title')}
              description={t('ganttGuide.features.color.description')}
            />
            <Feature
              title={t('ganttGuide.features.export.title')}
              description={t('ganttGuide.features.export.description')}
            />
            <Feature
              title={t('ganttGuide.features.storage.title')}
              description={t('ganttGuide.features.storage.description')}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* 快速開始 */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          {t('ganttGuide.quickStart.title')}
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
            {t('ganttGuide.quickStart.step1.title')}
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.7, pl: 2 }}>
            {t('ganttGuide.quickStart.step1.description')}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
            {t('ganttGuide.quickStart.step2.title')}
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.7, pl: 2 }}>
            {t('ganttGuide.quickStart.step2.description')}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
            {t('ganttGuide.quickStart.step3.title')}
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.7, pl: 2 }}>
            {t('ganttGuide.quickStart.step3.description')}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
            {t('ganttGuide.quickStart.step4.title')}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.05rem', lineHeight: 1.7, pl: 2 }}>
            {t('ganttGuide.quickStart.step4.description')}
          </Typography>
        </Box>
      </Paper>

      {/* 進階技巧 */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          {t('ganttGuide.tips.title')}
        </Typography>
        <Tip content={t('ganttGuide.tips.tip1')} />
        <Tip content={t('ganttGuide.tips.tip2')} />
        <Tip content={t('ganttGuide.tips.tip3')} />
        <Tip content={t('ganttGuide.tips.tip4')} />
        <Tip content={t('ganttGuide.tips.tip5')} />
      </Paper>

      {/* 使用場景 */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          {t('ganttGuide.useCases.title')}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, fontSize: '2rem' }}>
                📋
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {t('ganttGuide.useCases.project.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('ganttGuide.useCases.project.description')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, fontSize: '2rem' }}>
                👥
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {t('ganttGuide.useCases.team.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('ganttGuide.useCases.team.description')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, fontSize: '2rem' }}>
                🚀
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {t('ganttGuide.useCases.sprint.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('ganttGuide.useCases.sprint.description')}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 資料安全 */}
      <Paper sx={{ p: 4, bgcolor: 'primary.50' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
          🔒 {t('ganttGuide.security.title')}
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
          {t('ganttGuide.security.p1')}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
          {t('ganttGuide.security.p2')}
        </Typography>
      </Paper>
    </Container>
  );
}
