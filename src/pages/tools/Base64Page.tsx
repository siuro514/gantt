import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import { useTranslation } from 'react-i18next';
import ResizablePanels from '../../components/ResizablePanels';
import CryptoJS from 'crypto-js';

type EncodingType = 'base64' | 'hex' | 'url' | 'md5' | 'sha1' | 'sha256' | 'sha512';
type Base64LineBreak = 'none' | '64' | '76';

export default function Base64Page() {
  const { t } = useTranslation();
  const [encodingType, setEncodingType] = useState<EncodingType>('base64');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Base64 编码选项
  const [base64LineBreak, setBase64LineBreak] = useState<Base64LineBreak>('none');
  const [base64UrlSafe, setBase64UrlSafe] = useState(false);

  // 页面加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 判断当前编码类型是否可逆
  const isReversible = ['base64', 'hex', 'url'].includes(encodingType);

  // 编码函数
  const handleEncode = () => {
    if (!input.trim()) {
      setError(t('base64.messages.emptyInput'));
      setOutput('');
      return;
    }

    try {
      let encoded = '';
      
      switch (encodingType) {
        case 'base64':
          encoded = btoa(unescape(encodeURIComponent(input)));
          
          // 应用 URL-safe 模式
          if (base64UrlSafe) {
            encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
          }
          
          // 应用断行
          if (base64LineBreak !== 'none') {
            const charsPerLine = parseInt(base64LineBreak);
            const regex = new RegExp(`.{1,${charsPerLine}}`, 'g');
            encoded = encoded.match(regex)?.join('\n') || encoded;
          }
          break;
        
        case 'hex':
          encoded = Array.from(new TextEncoder().encode(input))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
          break;
        
        case 'url':
          encoded = encodeURIComponent(input);
          break;
        
        case 'md5':
          encoded = CryptoJS.MD5(input).toString();
          break;
        
        case 'sha1':
          encoded = CryptoJS.SHA1(input).toString();
          break;
        
        case 'sha256':
          encoded = CryptoJS.SHA256(input).toString();
          break;
        
        case 'sha512':
          encoded = CryptoJS.SHA512(input).toString();
          break;
      }
      
      setOutput(encoded);
      setError('');
      setSuccess(t('base64.messages.encodeSuccess'));
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(t('base64.messages.encodeFailed') + (err as Error).message);
      setOutput('');
      setSuccess('');
    }
  };

  // 解码函数（仅可逆编码支持）
  const handleDecode = () => {
    if (!output.trim()) {
      setError(t('base64.messages.emptyInput'));
      setInput('');
      return;
    }

    try {
      let decoded = '';
      
      switch (encodingType) {
        case 'base64':
          // 移除断行
          let base64Str = output.replace(/\n/g, '');
          
          // 处理 URL-safe 格式
          if (base64UrlSafe) {
            base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');
            // 补充填充
            while (base64Str.length % 4 !== 0) {
              base64Str += '=';
            }
          }
          
          decoded = decodeURIComponent(escape(atob(base64Str)));
          break;
        
        case 'hex':
          const hexStr = output.replace(/\s/g, '');
          if (!/^[0-9a-fA-F]+$/.test(hexStr) || hexStr.length % 2 !== 0) {
            throw new Error('Invalid hex string');
          }
          const bytes = new Uint8Array(hexStr.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
          decoded = new TextDecoder().decode(bytes);
          break;
        
        case 'url':
          decoded = decodeURIComponent(output);
          break;
      }
      
      setInput(decoded);
      setError('');
      setSuccess(t('base64.messages.decodeSuccess'));
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(t('base64.messages.decodeFailed'));
      setInput('');
      setSuccess('');
    }
  };

  // 切换编码类型时清空输入输出
  const handleEncodingTypeChange = (event: SelectChangeEvent<EncodingType>) => {
    setEncodingType(event.target.value as EncodingType);
    setInput('');
    setOutput('');
    setError('');
    setSuccess('');
  };

  // 左面板（输入）
  const leftPanel = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, pl: 1 }}>
        {t('base64.inputTitle.original')}
      </Typography>
      <TextField
        multiline
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t('base64.placeholder.input')}
        sx={{
          flex: 1,
          minHeight: '300px',
          '& .MuiInputBase-root': {
            height: '100%',
            minHeight: '300px',
            alignItems: 'flex-start',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
          },
          '& textarea': {
            height: '100% !important',
            overflow: 'auto !important',
          },
        }}
      />
      {error && (
        <Alert severity="error" sx={{ mt: 1 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 1 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
    </Box>
  );

  // 右面板（输出）
  const rightPanel = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, pl: 1 }}>
        {t('base64.outputTitle.encoded')}
      </Typography>
      <TextField
        multiline
        fullWidth
        value={output}
        onChange={(e) => setOutput(e.target.value)}
        placeholder={t('base64.placeholder.output')}
        sx={{
          flex: 1,
          minHeight: '300px',
          '& .MuiInputBase-root': {
            height: '100%',
            minHeight: '300px',
            alignItems: 'flex-start',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
          },
          '& textarea': {
            height: '100% !important',
            overflow: 'auto !important',
          },
        }}
      />
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', gap: 3 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 2,
            backgroundColor: '#70AD7F20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#70AD7F',
            flexShrink: 0,
          }}
        >
          <CodeIcon sx={{ fontSize: '2rem' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            {t('base64.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('base64.description')}
          </Typography>
        </Box>
      </Box>

      {/* Encoding Type Selector */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="encoding-type-label">{t('base64.encodingType')}</InputLabel>
          <Select
            labelId="encoding-type-label"
            id="encoding-type-select"
            value={encodingType}
            label={t('base64.encodingType')}
            onChange={handleEncodingTypeChange}
          >
            <MenuItem value="base64">Base64</MenuItem>
            <MenuItem value="hex">Hexadecimal (Hex)</MenuItem>
            <MenuItem value="url">URL Encode</MenuItem>
            <MenuItem value="md5">MD5 Hash</MenuItem>
            <MenuItem value="sha1">SHA-1 Hash</MenuItem>
            <MenuItem value="sha256">SHA-256 Hash</MenuItem>
            <MenuItem value="sha512">SHA-512 Hash</MenuItem>
          </Select>
        </FormControl>
        {!isReversible && (
          <Typography variant="caption" color="warning.main" sx={{ ml: 2 }}>
            ⚠️ {t('base64.messages.irreversible')}
          </Typography>
        )}
      </Box>

      {/* Base64 编码选项 */}
      {encodingType === 'base64' && (
        <Box sx={{ mb: 3, display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="line-break-label">{t('base64.options.lineBreak')}</InputLabel>
            <Select
              labelId="line-break-label"
              id="line-break-select"
              value={base64LineBreak}
              label={t('base64.options.lineBreak')}
              onChange={(e) => setBase64LineBreak(e.target.value as Base64LineBreak)}
              size="small"
            >
              <MenuItem value="none">{t('base64.options.noLineBreak')}</MenuItem>
              <MenuItem value="64">{t('base64.options.lineBreak64')}</MenuItem>
              <MenuItem value="76">{t('base64.options.lineBreak76')}</MenuItem>
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Checkbox
                checked={base64UrlSafe}
                onChange={(e) => setBase64UrlSafe(e.target.checked)}
              />
            }
            label={t('base64.options.urlSafe')}
          />
        </Box>
      )}

      {/* Resizable Panels */}
      <ResizablePanels
        leftPanel={leftPanel}
        rightPanel={rightPanel}
        onParse={handleEncode}
        onSave={isReversible ? handleDecode : undefined}
        canParse={!!input}
        canSave={isReversible && !!output}
      />

      {/* Usage Tips */}
      <Box sx={{ mt: 4, p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          💡 {t('base64.info.whatIsBase64')}
        </Typography>
        <Typography variant="body2" paragraph>
          {t('base64.info.description')}
        </Typography>
        
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
          📚 {t('base64.info.encodingTypes')}
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Base64:</strong> {t('base64.info.base64Desc')}
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Hexadecimal:</strong> {t('base64.info.hexDesc')}
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>URL Encode:</strong> {t('base64.info.urlDesc')}
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>Hash (MD5/SHA):</strong> {t('base64.info.hashDesc')}
          </Typography>
        </Box>

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
      </Box>
    </Container>
  );
}
