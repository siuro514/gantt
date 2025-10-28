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
import CodeIcon from '@mui/icons-material/Code';
import CompressIcon from '@mui/icons-material/Compress';
import JsonEditor from '@/components/JsonEditor';
import ResizablePanels from '@/components/ResizablePanels';

type ViewMode = 'text' | 'tree';

const STORAGE_KEY = 'json_parser_input';

export default function JsonParserPage() {
  const [input, setInput] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('text');
  const [isMinified, setIsMinified] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      setSuccess('解析成功！現在可以編輯 JSON 資料');
    } catch (err) {
      setError('JSON 格式錯誤：' + (err as Error).message);
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
      setSuccess('已複製到剪貼簿！');
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
      setSuccess('已更新到左側輸入框！');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    saveToLocalStorage(value);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          📝 JSON 格式化工具
        </Typography>
        <Typography variant="body1" color="text.secondary">
          格式化、驗證和編輯 JSON 資料，支援可視化編輯、增刪節點等功能
        </Typography>
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
                <Typography variant="h6" sx={{ pt: 0.5 }}>輸入 JSON</Typography>
                <Tooltip title="清空">
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
                  placeholder='{"name": "John", "age": 30}'
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
                <Typography variant="h6" sx={{ pt: 0.5 }}>可編輯結果</Typography>
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
                      <Tooltip title="樹狀編輯">
                        <EditIcon fontSize="small" />
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="text">
                      <Tooltip title="文字檢視">
                        <CodeIcon fontSize="small" />
                      </Tooltip>
                    </ToggleButton>
                  </ToggleButtonGroup>
                  {viewMode === 'text' && parsedData && (
                    <Tooltip title={isMinified ? "格式化" : "簡潔化"}>
                      <IconButton 
                        onClick={() => setIsMinified(!isMinified)}
                        color={isMinified ? "primary" : "default"}
                      >
                        <CompressIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="複製到剪貼簿">
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
                    點擊中間分隔欄的向右箭頭開始編輯 JSON
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
          💡 使用說明
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            將 JSON 字串貼到左側輸入框
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            點擊「解析並編輯」按鈕解析 JSON 並進入可視化編輯模式
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            在樹狀編輯模式中，可以直接修改值、類型轉換、增刪節點
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            陣列和物件可以點擊「+」按鈕添加新項目/屬性
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            每個節點都可以透過下拉選單轉換類型（字串、數字、布林值等）
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            在文字檢視模式中，點擊「簡潔化」按鈕可壓縮 JSON（去除空格和換行）
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            拖曳中間分隔線可調整左右窗格大小
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            編輯完成後點擊「儲存」按鈕將結果更新回左側輸入框
          </Typography>
          <Typography component="li" variant="body2">
            所有處理都在瀏覽器本機完成，不會上傳你的資料
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

