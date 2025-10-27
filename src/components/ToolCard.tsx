import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Tool } from '@/data/tools';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const navigate = useNavigate();

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
      onClick={() => navigate(tool.path)}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 2,
            backgroundColor: tool.color + '15',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            fontSize: '2rem',
          }}
        >
          {tool.icon}
        </Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {tool.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
          {tool.description}
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
          開始使用
        </Button>
      </CardContent>
    </Card>
  );
}

