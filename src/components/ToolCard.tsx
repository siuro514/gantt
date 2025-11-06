import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Tool } from '@/data/tools';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import LockIcon from '@mui/icons-material/Lock';
import ImageIcon from '@mui/icons-material/Image';
import SecurityIcon from '@mui/icons-material/Security';
import { useTranslation } from 'react-i18next';
import { LANG_CODE_TO_PATH } from './LanguageRouter';

interface ToolCardProps {
  tool: Tool;
}

const iconMap: Record<string, React.ReactElement> = {
  ViewTimeline: <ViewTimelineIcon />,
  Code: <CodeIcon />,
  DataObject: <DataObjectIcon />,
  Lock: <LockIcon />,
  Image: <ImageIcon />,
  Security: <SecurityIcon />,
};

// Map tool IDs to translation keys
const toolI18nMap: Record<string, string> = {
  'gantt': 'gantt',
  'json-parser': 'jsonParser',
  'base64': 'base64',
  'image-compressor': 'imageCompressor',
  'crypto': 'crypto',
};

export default function ToolCard({ tool }: ToolCardProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  
  // 获取当前语言路径前缀
  const langPrefix = `/${lang || LANG_CODE_TO_PATH[i18n.language] || 'en'}`;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
      }}
      onClick={() => navigate(langPrefix + tool.path)}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 2,
            backgroundColor: tool.color + '20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            color: tool.color,
            '& svg': {
              fontSize: '2rem',
            },
          }}
        >
          {iconMap[tool.icon] || <CodeIcon />}
        </Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {t(`tools.${toolI18nMap[tool.id]}.name`)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
          {t(`tools.${toolI18nMap[tool.id]}.description`)}
        </Typography>
        <Button
          variant="text"
          endIcon={<ArrowForwardIcon />}
          sx={{
            alignSelf: 'flex-start',
            color: tool.color,
            '&:hover': {
              backgroundColor: tool.color + '15',
            },
          }}
        >
          {t('tools.startUsing')}
        </Button>
      </CardContent>
    </Card>
  );
}

