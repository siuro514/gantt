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
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

export default function JsonParserPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError('');
      setSuccess('格式化成功！');
    } catch (err) {
      setError('JSON 格式錯誤：' + (err as Error).message);
      setOutput('');
      setSuccess('');
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
      setSuccess('壓縮成功！');
    } catch (err) {
      setError('JSON 格式錯誤：' + (err as Error).message);
      setOutput('');
      setSuccess('');
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          📝 JSON 格式化工具
        </Typography>
        <Typography variant="body1" color="text.secondary">
          格式化、驗證和美化 JSON 資料，支援語法檢測和一鍵複製
        </Typography>
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
            <Typography variant="h6">輸入 JSON</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={handleFormat} startIcon={<FormatAlignLeftIcon />}>
                格式化
              </Button>
              <Button variant="outlined" onClick={handleMinify}>
                壓縮
              </Button>
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
            rows={20}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name": "John", "age": 30}'
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
            <Typography variant="h6">輸出結果</Typography>
            <Tooltip title="複製到剪貼簿">
              <IconButton onClick={handleCopy} disabled={!output}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <TextField
            multiline
            fullWidth
            rows={20}
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
          💡 使用說明
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            將 JSON 字串貼到左側輸入框
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            點擊「格式化」按鈕可以美化 JSON，使其更易讀
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            點擊「壓縮」按鈕可以去除空格和換行，減少檔案大小
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            工具會自動驗證 JSON 語法，如有錯誤會顯示提示
          </Typography>
          <Typography component="li" variant="body2">
            所有處理都在瀏覽器本地完成，不會上傳你的資料
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

