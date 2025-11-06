import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Paper,
  Alert,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import EditIcon from '@mui/icons-material/Edit';
import DataObjectIcon from '@mui/icons-material/DataObject';
import CodeIcon from '@mui/icons-material/Code';
import CompressIcon from '@mui/icons-material/Compress';
import JsonEditor from '@/components/JsonEditor';
import ResizablePanels from '@/components/ResizablePanels';
import { useTranslation } from 'react-i18next';

type ViewMode = 'text' | 'tree';

const STORAGE_KEY = 'json_parser_input';

export default function JsonParserPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('text');
  const [isMinified, setIsMinified] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 页面加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 从 localStorage 加载数据
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setInput(saved);
      }
    } catch (err) {
      console.error('Failed to load from localStorage:', err);
    }
  }, []);

  // 保存到 localStorage
  const saveToLocalStorage = (value: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      setParsedData(parsed);
      setViewMode('tree');
      setIsMinified(false); // 重置简洁化状态
      setError('');
      setSuccess(t('jsonParser.messages.parseSuccess'));
    } catch (err) {
      setError(t('jsonParser.messages.parseError') + (err as Error).message);
      setParsedData(null);
      setSuccess('');
    }
  };

  const handleCopy = () => {
    if (parsedData) {
      let textToCopy: string;
      if (viewMode === 'text') {
        textToCopy = isMinified 
          ? JSON.stringify(parsedData)
          : JSON.stringify(parsedData, null, 2);
      } else {
        textToCopy = JSON.stringify(parsedData, null, 2);
      }
      navigator.clipboard.writeText(textToCopy);
      setSuccess(t('jsonParser.messages.copySuccess'));
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setParsedData(null);
    setIsMinified(false);
    setError('');
    setSuccess('');
  };

  const handleDataChange = (newData: any) => {
    setParsedData(newData);
  };

  const handleSave = () => {
    if (parsedData) {
      let formatted: string;
      if (viewMode === 'text' && isMinified) {
        formatted = JSON.stringify(parsedData);
      } else {
        formatted = JSON.stringify(parsedData, null, 2);
      }
      setInput(formatted);
      saveToLocalStorage(formatted);
      setSuccess(t('jsonParser.messages.saveSuccess'));
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    saveToLocalStorage(value);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', gap: 3 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 2,
            backgroundColor: '#5B9BD520',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#5B9BD5',
            flexShrink: 0,
          }}
        >
          <DataObjectIcon sx={{ fontSize: '2rem' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            {t('jsonParser.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('jsonParser.description')}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
        <ResizablePanels
          onParse={handleFormat}
          onSave={handleSave}
          canParse={!!input}
          canSave={!!parsedData}
          leftPanel={
            <Box sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pl: 2, pr: 2, pt: 2, minHeight: '64px' }}>
                <Typography variant="h6" sx={{ pt: 0.5 }}>{t('jsonParser.inputTitle')}</Typography>
                <Tooltip title={t('jsonParser.buttons.clear')}>
                  <IconButton onClick={handleClear} size="small">
                    <DeleteSweepIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: 1, pt: 2 }}>
                <TextField
                  multiline
                  fullWidth
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={t('jsonParser.placeholder')}
                  sx={{
                    flex: '1 1 auto',
                    minHeight: '450px',
                    '& .MuiInputBase-root': {
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      minHeight: '450px',
                      alignItems: 'flex-start',
                      borderRadius: 1,
                    },
                  }}
                />
                {error && (
                  <Alert severity="error" onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" onClose={() => setSuccess('')}>
                    {success}
                  </Alert>
                )}
              </Box>
            </Box>
          }
          rightPanel={
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pl: 2, pr: 2, pt: 2, minHeight: '64px' }}>
                <Typography variant="h6" sx={{ pt: 0.5 }}>{t('jsonParser.outputTitle')}</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(_, newMode) => {
                      if (newMode !== null) {
                        setViewMode(newMode);
                        setIsMinified(false); // 切换模式时重置简洁化状态
                      }
                    }}
                    size="small"
                  >
                    <ToggleButton value="tree">
                      <Tooltip title={t('jsonParser.buttons.treeEdit')}>
                        <EditIcon fontSize="small" />
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="text">
                      <Tooltip title={t('jsonParser.buttons.textView')}>
                        <CodeIcon fontSize="small" />
                      </Tooltip>
                    </ToggleButton>
                  </ToggleButtonGroup>
                  {viewMode === 'text' && parsedData && (
                    <Tooltip title={isMinified ? t('jsonParser.buttons.format') : t('jsonParser.buttons.minify')}>
                      <IconButton 
                        onClick={() => setIsMinified(!isMinified)}
                        color={isMinified ? "primary" : "default"}
                      >
                        <CompressIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title={t('jsonParser.buttons.copy')}>
                    <IconButton onClick={handleCopy} disabled={!parsedData}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                  mt: 2,
                  overflowX: 'auto',
                  minWidth: 0,
                  minHeight: '450px',
                }}
              >
                {parsedData ? (
                  viewMode === 'tree' ? (
                    <JsonEditor data={parsedData} onChange={handleDataChange} />
                  ) : (
                    <Box sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      whiteSpace: isMinified ? 'pre-wrap' : 'pre',
                      wordBreak: isMinified ? 'break-all' : 'normal',
                    }}>
                      {isMinified 
                        ? JSON.stringify(parsedData)
                        : JSON.stringify(parsedData, null, 2)
                      }
                    </Box>
                  )
                ) : (
                  <Typography color="text.secondary" sx={{ textAlign: 'center', py: 10 }}>
                    {t('jsonParser.messages.emptyState')}
                  </Typography>
                )}
              </Box>
            </Box>
          }
        />
      </Box>

      {/* Usage Tips */}
      <Paper sx={{ mt: 4, p: 3, backgroundColor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          💡 {t('jsonParser.tips.title')}
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            {t('jsonParser.tips.tip1')}
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            {t('jsonParser.tips.tip2')}
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            {t('jsonParser.tips.tip3')}
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            {t('jsonParser.tips.tip4')}
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            {t('jsonParser.tips.tip5')}
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            {t('jsonParser.tips.tip6')}
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            {t('jsonParser.tips.tip7')}
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            {t('jsonParser.tips.tip8')}
          </Typography>
          <Typography component="li" variant="body2">
            {t('jsonParser.tips.tip9')}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

