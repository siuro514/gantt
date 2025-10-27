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

export default function Base64Page() {
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
      setSuccess('編碼成功！');
    } catch (err) {
      setError('編碼失敗：' + (err as Error).message);
      setOutput('');
      setSuccess('');
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setOutput(decoded);
      setError('');
      setSuccess('解碼成功！');
    } catch (err) {
      setError('解碼失敗：請確認輸入的是有效的 Base64 字串');
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
      setSuccess('已複製到剪貼簿！');
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
          🔐 Base64 編碼/解碼
        </Typography>
        <Typography variant="body1" color="text.secondary">
          快速進行 Base64 編碼和解碼，支援中文和特殊字元
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
            編碼 (Encode)
          </ToggleButton>
          <ToggleButton value="decode" aria-label="decode">
            解碼 (Decode)
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
              {mode === 'encode' ? '原始文字' : 'Base64 字串'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={handleProcess}>
                {mode === 'encode' ? '編碼' : '解碼'}
              </Button>
              <Tooltip title="交換輸入輸出">
                <IconButton onClick={handleSwap} size="small">
                  <SwapVertIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="清空">
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
            placeholder={
              mode === 'encode'
                ? '輸入要編碼的文字...'
                : '輸入要解碼的 Base64 字串...'
            }
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
              {mode === 'encode' ? 'Base64 結果' : '解碼結果'}
            </Typography>
            <Tooltip title="複製到剪貼簿">
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
          💡 什麼是 Base64？
        </Typography>
        <Typography variant="body2" paragraph>
          Base64 是一種用 64 個可列印字元來表示二進位資料的編碼方式。
          常用於在文字環境中傳輸二進位資料，如電子郵件附件、資料 URL 等。
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
          🔧 使用場景
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            將圖片嵌入 HTML/CSS 中（Data URL）
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            HTTP Basic Authentication
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            在 URL 中傳遞複雜參數
          </Typography>
          <Typography component="li" variant="body2">
            資料加密前的編碼（注意：Base64 不是加密！）
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

