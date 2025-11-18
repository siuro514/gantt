import { Container, Box, Typography, Accordion, AccordionSummary, AccordionDetails, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function FAQPage() {
  const { t } = useTranslation();

  const FAQItem = ({ question, answer }: { question: string; answer: string }) => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          {question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
          {answer}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          {t('faq.title')}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
          {t('faq.subtitle')}
        </Typography>
      </Box>

      {/* 一般問題 */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          {t('faq.general.title')}
        </Typography>
        <FAQItem 
          question={t('faq.general.q1.question')} 
          answer={t('faq.general.q1.answer')} 
        />
        <FAQItem 
          question={t('faq.general.q2.question')} 
          answer={t('faq.general.q2.answer')} 
        />
        <FAQItem 
          question={t('faq.general.q3.question')} 
          answer={t('faq.general.q3.answer')} 
        />
        <FAQItem 
          question={t('faq.general.q4.question')} 
          answer={t('faq.general.q4.answer')} 
        />
      </Paper>

      {/* 甘特圖相關 */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          {t('faq.gantt.title')}
        </Typography>
        <FAQItem 
          question={t('faq.gantt.q1.question')} 
          answer={t('faq.gantt.q1.answer')} 
        />
        <FAQItem 
          question={t('faq.gantt.q2.question')} 
          answer={t('faq.gantt.q2.answer')} 
        />
        <FAQItem 
          question={t('faq.gantt.q3.question')} 
          answer={t('faq.gantt.q3.answer')} 
        />
        <FAQItem 
          question={t('faq.gantt.q4.question')} 
          answer={t('faq.gantt.q4.answer')} 
        />
        <FAQItem 
          question={t('faq.gantt.q5.question')} 
          answer={t('faq.gantt.q5.answer')} 
        />
      </Paper>

      {/* 技術問題 */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          {t('faq.technical.title')}
        </Typography>
        <FAQItem 
          question={t('faq.technical.q1.question')} 
          answer={t('faq.technical.q1.answer')} 
        />
        <FAQItem 
          question={t('faq.technical.q2.question')} 
          answer={t('faq.technical.q2.answer')} 
        />
        <FAQItem 
          question={t('faq.technical.q3.question')} 
          answer={t('faq.technical.q3.answer')} 
        />
      </Paper>

      {/* 其他工具 */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          {t('faq.tools.title')}
        </Typography>
        <FAQItem 
          question={t('faq.tools.q1.question')} 
          answer={t('faq.tools.q1.answer')} 
        />
        <FAQItem 
          question={t('faq.tools.q2.question')} 
          answer={t('faq.tools.q2.answer')} 
        />
        <FAQItem 
          question={t('faq.tools.q3.question')} 
          answer={t('faq.tools.q3.answer')} 
        />
      </Paper>

      {/* 聯絡資訊 */}
      <Paper sx={{ p: 4, bgcolor: 'primary.50', textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          {t('faq.contact.title')}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.05rem', lineHeight: 1.7, mt: 2 }}>
          {t('faq.contact.description')}
        </Typography>
      </Paper>
    </Container>
  );
}
