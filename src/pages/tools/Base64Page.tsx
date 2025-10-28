import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useTranslation } from 'react-i18next';

export default function Base64Page() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEncode = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
      setError('');
      setSuccess(t('base64.messages.encodeSuccess'));
    } catch (err) {
      setError(t('base64.messages.encodeFailed') + (err as Error).message);
      setOutput('');
      setSuccess('');
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      setError('');
      setSuccess(t('base64.messages.decodeSuccess'));
    } catch (err) {
      setError(t('base64.messages.decodeFailed'));
      setOutput('');
      setSuccess('');
    }
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setSuccess(t('base64.messages.copySuccess'));
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setSuccess('');
  };

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          🔐 {t('base64.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('base64.description')}
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, newMode) => {
            if (newMode !== null) {
              setMode(newMode);
              setOutput('');
              setError('');
              setSuccess('');
            }
          }}
          aria-label="mode"
        >
          <ToggleButton value="encode" aria-label="encode">
            {t('base64.mode.encode')}
          </ToggleButton>
          <ToggleButton value="decode" aria-label="decode">
            {t('base64.mode.decode')}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
        <Paper sx={{ flex: 1, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {t(`base64.inputTitle.${mode}`)}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={handleProcess}>
                {t(`base64.buttons.${mode}`)}
              </Button>
              <Tooltip title={t('base64.buttons.swap')}>
                <IconButton onClick={handleSwap} size="small">
                  <SwapVertIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('base64.buttons.clear')}>
                <IconButton onClick={handleClear} size="small">
                  <DeleteSweepIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <TextField
            multiline
            fullWidth
            rows={15}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(`base64.placeholder.${mode}`)}
            sx={{
              '& .MuiInputBase-root': {
                fontFamily: 'monospace',
                fontSize: '0.9rem',
              },
            }}
          />
        </Paper>

        <Paper sx={{ flex: 1, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              {t(`base64.outputTitle.${mode}`)}
            </Typography>
            <Tooltip title={t('base64.buttons.copy')}>
              <IconButton onClick={handleCopy} disabled={!output}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <TextField
            multiline
            fullWidth
            rows={15}
            value={output}
            InputProps={{
              readOnly: true,
            }}
            sx={{
              '& .MuiInputBase-root': {
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                backgroundColor: 'grey.50',
              },
            }}
          />
        </Paper>
      </Box>

      {/* Usage Tips */}
      <Paper sx={{ mt: 4, p: 3, backgroundColor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          💡 {t('base64.info.whatIsBase64')}
        </Typography>
        <Typography variant="body2" paragraph>
          {t('base64.info.description')}
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
          🔧 {t('base64.info.useCases')}
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            {t('base64.info.useCase1')}
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            {t('base64.info.useCase2')}
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            {t('base64.info.useCase3')}
          </Typography>
          <Typography component="li" variant="body2">
            {t('base64.info.useCase4')}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

