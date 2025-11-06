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
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Button,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import RefreshIcon from '@mui/icons-material/Refresh';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { useTranslation } from 'react-i18next';
import ResizablePanels from '../../components/ResizablePanels';
import CryptoJS from 'crypto-js';

type CryptoType = 'symmetric' | 'asymmetric';
type SymmetricAlgorithm = 'aes' | 'des' | '3des' | 'rc4' | 'rabbit';
type SymmetricMode = 'gcm' | 'cbc' | 'ecb' | 'cfb' | 'ofb' | 'ctr';
type OutputFormat = 'base64' | 'hex';

export default function CryptoPage() {
  const { t } = useTranslation();
  
  // 加密类型选择
  const [cryptoType, setCryptoType] = useState<CryptoType>('symmetric');
  
  // 对称加密状态
  const [algorithm, setAlgorithm] = useState<SymmetricAlgorithm>('aes');
  const [mode, setMode] = useState<SymmetricMode>('gcm');
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  
  // 非对称加密状态
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [rsaKeySize, setRsaKeySize] = useState<2048 | 4096>(2048);
  
  // 通用状态
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('base64');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);

  // 页面加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 当算法变化时，清空密钥和 IV（因为不同算法需要不同长度）
  useEffect(() => {
    setKey('');
    setIv('');
  }, [algorithm]);

  // 某些算法不支持模式选择
  const supportsModes = ['aes', 'des', '3des'].includes(algorithm);

  // GCM 模式需要特殊处理
  const isGcmMode = mode === 'gcm';

  // 获取密钥长度提示
  const getKeyLengthHint = () => {
    switch (algorithm) {
      case 'aes':
        return 'Required: 64 hex characters (32 bytes)';
      case '3des':
        return 'Required: 48 hex characters (24 bytes)';
      case 'des':
        return 'Required: 16 hex characters (8 bytes)';
      default:
        return 'Required: 32 hex characters (16 bytes)';
    }
  };

  // 获取 IV 长度提示
  const getIVLengthHint = () => {
    if (isGcmMode) {
      return 'Required: 24 hex characters (12 bytes)';
    } else if (algorithm === 'des' || algorithm === '3des') {
      return 'Required: 16 hex characters (8 bytes)';
    } else {
      return 'Required: 32 hex characters (16 bytes)';
    }
  };

  // 生成随机密钥（对称加密）
  const generateRandomKey = () => {
    let length;
    switch (algorithm) {
      case 'aes':
        length = 32; // AES-256 需要 32 字节
        break;
      case '3des':
        length = 24; // 3DES 需要 24 字节 (192 位)
        break;
      case 'des':
        length = 8;  // DES 需要 8 字节 (56 位 + 8 位校验)
        break;
      default:
        length = 16; // RC4, Rabbit 等
        break;
    }
    const randomKey = CryptoJS.lib.WordArray.random(length).toString();
    setKey(randomKey);
  };

  // 生成随机 IV
  const generateRandomIV = () => {
    let length;
    if (isGcmMode) {
      length = 12; // GCM 推荐 12 字节
    } else if (algorithm === 'des' || algorithm === '3des') {
      length = 8;  // DES/3DES 需要 8 字节 IV
    } else {
      length = 16; // AES 等需要 16 字节
    }
    const randomIV = CryptoJS.lib.WordArray.random(length).toString();
    setIv(randomIV);
  };

  // 生成 RSA 密钥对
  const generateRSAKeyPair = async () => {
    setIsGeneratingKeys(true);
    setError('');
    
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: rsaKeySize,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      );

      // 导出公钥
      const exportedPublicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
      const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedPublicKey)));
      const publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${publicKeyBase64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;
      
      // 导出私钥
      const exportedPrivateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
      const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedPrivateKey)));
      const privateKeyPem = `-----BEGIN PRIVATE KEY-----\n${privateKeyBase64.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`;

      setPublicKey(publicKeyPem);
      setPrivateKey(privateKeyPem);
      setSuccess(t('crypto.messages.keyGenerated'));
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(t('crypto.messages.keyGenFailed') + (err as Error).message);
    } finally {
      setIsGeneratingKeys(false);
    }
  };

  // 对称加密
  const handleSymmetricEncrypt = () => {
    if (!input.trim()) {
      setError(t('crypto.messages.emptyInput'));
      setOutput('');
      return;
    }

    if (!key.trim()) {
      setError(t('crypto.messages.emptyKey'));
      setOutput('');
      return;
    }

    try {
      let encrypted;
      const keyHex = CryptoJS.enc.Hex.parse(key);
      const ivHex = iv ? CryptoJS.enc.Hex.parse(iv) : undefined;

      const config: any = {
        padding: CryptoJS.pad.Pkcs7,
      };
      
      if (isGcmMode) {
        // GCM 模式使用 CTR 模式模拟（CryptoJS 不直接支持 GCM）
        config.mode = CryptoJS.mode.CTR;
        if (ivHex) config.iv = ivHex;
      } else {
        if (supportsModes && mode) {
          config.mode = (CryptoJS.mode as any)[mode.toUpperCase()];
        }
        if (ivHex && mode !== 'ecb') {
          config.iv = ivHex;
        }
      }

      switch (algorithm) {
        case 'aes':
          encrypted = CryptoJS.AES.encrypt(input, keyHex, config);
          break;
        case 'des':
          encrypted = CryptoJS.DES.encrypt(input, keyHex, config);
          break;
        case '3des':
          encrypted = CryptoJS.TripleDES.encrypt(input, keyHex, config);
          break;
        case 'rc4':
          encrypted = CryptoJS.RC4.encrypt(input, keyHex);
          break;
        case 'rabbit':
          encrypted = CryptoJS.Rabbit.encrypt(input, keyHex, config);
          break;
      }

      const result = outputFormat === 'base64' 
        ? encrypted.toString() 
        : encrypted.ciphertext.toString();

      setOutput(result);
      setError('');
      setSuccess(t('crypto.messages.encryptSuccess'));
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(t('crypto.messages.encryptFailed') + (err as Error).message);
      setOutput('');
      setSuccess('');
    }
  };

  // 对称解密
  const handleSymmetricDecrypt = () => {
    if (!output.trim()) {
      setError(t('crypto.messages.emptyInput'));
      setInput('');
      return;
    }

    if (!key.trim()) {
      setError(t('crypto.messages.emptyKey'));
      setInput('');
      return;
    }

    try {
      const keyHex = CryptoJS.enc.Hex.parse(key);
      const ivHex = iv ? CryptoJS.enc.Hex.parse(iv) : undefined;

      const config: any = {
        padding: CryptoJS.pad.Pkcs7,
      };
      
      if (isGcmMode) {
        config.mode = CryptoJS.mode.CTR;
        if (ivHex) config.iv = ivHex;
      } else {
        if (supportsModes && mode) {
          config.mode = (CryptoJS.mode as any)[mode.toUpperCase()];
        }
        if (ivHex && mode !== 'ecb') {
          config.iv = ivHex;
        }
      }

      // 根据输出格式构造密文对象
      let ciphertext;
      if (outputFormat === 'base64') {
        ciphertext = output;
      } else {
        // Hex 格式：需要转换为 Base64
        ciphertext = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(output));
      }

      let decrypted;
      switch (algorithm) {
        case 'aes':
          decrypted = CryptoJS.AES.decrypt(ciphertext, keyHex, config);
          break;
        case 'des':
          decrypted = CryptoJS.DES.decrypt(ciphertext, keyHex, config);
          break;
        case '3des':
          decrypted = CryptoJS.TripleDES.decrypt(ciphertext, keyHex, config);
          break;
        case 'rc4':
          decrypted = CryptoJS.RC4.decrypt(ciphertext, keyHex);
          break;
        case 'rabbit':
          decrypted = CryptoJS.Rabbit.decrypt(ciphertext, keyHex, config);
          break;
      }

      const result = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!result) {
        throw new Error('Decryption failed - invalid key or corrupted data');
      }

      setInput(result);
      setError('');
      setSuccess(t('crypto.messages.decryptSuccess'));
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(t('crypto.messages.decryptFailed'));
      setInput('');
      setSuccess('');
    }
  };

  // RSA 加密
  const handleRSAEncrypt = async () => {
    if (!input.trim()) {
      setError(t('crypto.messages.emptyInput'));
      setOutput('');
      return;
    }

    if (!publicKey.trim()) {
      setError(t('crypto.messages.emptyPublicKey'));
      setOutput('');
      return;
    }

    try {
      // 解析 PEM 格式公钥
      const pemHeader = '-----BEGIN PUBLIC KEY-----';
      const pemFooter = '-----END PUBLIC KEY-----';
      const pemContents = publicKey.replace(pemHeader, '').replace(pemFooter, '').replace(/\s/g, '');
      const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

      // 导入公钥
      const cryptoKey = await window.crypto.subtle.importKey(
        'spki',
        binaryDer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['encrypt']
      );

      // 加密
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const encryptedData = await window.crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        cryptoKey,
        data
      );

      // 转换为 Base64 或 Hex
      const encryptedArray = new Uint8Array(encryptedData);
      let result;
      if (outputFormat === 'base64') {
        result = btoa(String.fromCharCode(...encryptedArray));
      } else {
        result = Array.from(encryptedArray).map(b => b.toString(16).padStart(2, '0')).join('');
      }

      setOutput(result);
      setError('');
      setSuccess(t('crypto.messages.encryptSuccess'));
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(t('crypto.messages.encryptFailed') + (err as Error).message);
      setOutput('');
      setSuccess('');
    }
  };

  // RSA 解密
  const handleRSADecrypt = async () => {
    if (!output.trim()) {
      setError(t('crypto.messages.emptyInput'));
      setInput('');
      return;
    }

    if (!privateKey.trim()) {
      setError(t('crypto.messages.emptyPrivateKey'));
      setInput('');
      return;
    }

    try {
      // 解析 PEM 格式私钥
      const pemHeader = '-----BEGIN PRIVATE KEY-----';
      const pemFooter = '-----END PRIVATE KEY-----';
      const pemContents = privateKey.replace(pemHeader, '').replace(pemFooter, '').replace(/\s/g, '');
      const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

      // 导入私钥
      const cryptoKey = await window.crypto.subtle.importKey(
        'pkcs8',
        binaryDer,
        { name: 'RSA-OAEP', hash: 'SHA-256' },
        false,
        ['decrypt']
      );

      // 解析密文
      let encryptedData;
      if (outputFormat === 'base64') {
        const binaryString = atob(output);
        encryptedData = Uint8Array.from(binaryString, c => c.charCodeAt(0));
      } else {
        encryptedData = new Uint8Array(output.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      }

      // 解密
      const decryptedData = await window.crypto.subtle.decrypt(
        { name: 'RSA-OAEP' },
        cryptoKey,
        encryptedData
      );

      const decoder = new TextDecoder();
      const result = decoder.decode(decryptedData);

      setInput(result);
      setError('');
      setSuccess(t('crypto.messages.decryptSuccess'));
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(t('crypto.messages.decryptFailed'));
      setInput('');
      setSuccess('');
    }
  };

  // 统一的加密/解密处理
  const handleEncrypt = () => {
    if (cryptoType === 'symmetric') {
      handleSymmetricEncrypt();
    } else {
      handleRSAEncrypt();
    }
  };

  const handleDecrypt = () => {
    if (cryptoType === 'symmetric') {
      handleSymmetricDecrypt();
    } else {
      handleRSADecrypt();
    }
  };

  // 左面板（原始文本）
  const leftPanel = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, pl: 1 }}>
        {t('crypto.inputTitle')}
      </Typography>
      <TextField
        multiline
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t('crypto.placeholder.input')}
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

  // 右面板（加密文本）
  const rightPanel = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, pl: 1 }}>
        {t('crypto.outputTitle')}
      </Typography>
      <TextField
        multiline
        fullWidth
        value={output}
        onChange={(e) => setOutput(e.target.value)}
        placeholder={t('crypto.placeholder.output')}
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
            backgroundColor: '#E6745520',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#E67455',
            flexShrink: 0,
          }}
        >
          <LockIcon sx={{ fontSize: '2rem' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            {t('crypto.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('crypto.description')}
          </Typography>
        </Box>
      </Box>

      {/* Crypto Type Selection */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={cryptoType}
          exclusive
          onChange={(_, newType) => newType && setCryptoType(newType)}
          sx={{ mb: 3 }}
        >
          <ToggleButton value="symmetric">
            <VpnKeyIcon sx={{ mr: 1 }} />
            {t('crypto.symmetric')}
          </ToggleButton>
          <ToggleButton value="asymmetric">
            <LockIcon sx={{ mr: 1 }} />
            {t('crypto.asymmetric')}
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Symmetric Encryption Settings */}
        {cryptoType === 'symmetric' && (
          <>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="algorithm-label">{t('crypto.algorithm')}</InputLabel>
                <Select
                  labelId="algorithm-label"
                  value={algorithm}
                  label={t('crypto.algorithm')}
                  onChange={(e: SelectChangeEvent<SymmetricAlgorithm>) => setAlgorithm(e.target.value as SymmetricAlgorithm)}
                >
                  <MenuItem value="aes">AES-256</MenuItem>
                  <MenuItem value="des">DES</MenuItem>
                  <MenuItem value="3des">3DES (Triple DES)</MenuItem>
                  <MenuItem value="rc4">RC4</MenuItem>
                  <MenuItem value="rabbit">Rabbit</MenuItem>
                </Select>
              </FormControl>

              {supportsModes && (
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id="mode-label">{t('crypto.mode')}</InputLabel>
                  <Select
                    labelId="mode-label"
                    value={mode}
                    label={t('crypto.mode')}
                    onChange={(e: SelectChangeEvent<SymmetricMode>) => setMode(e.target.value as SymmetricMode)}
                  >
                    <MenuItem value="gcm">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        GCM ⭐
                      </Box>
                    </MenuItem>
                    <MenuItem value="cbc">CBC</MenuItem>
                    <MenuItem value="ecb">ECB</MenuItem>
                    <MenuItem value="cfb">CFB</MenuItem>
                    <MenuItem value="ofb">OFB</MenuItem>
                    <MenuItem value="ctr">CTR</MenuItem>
                  </Select>
                </FormControl>
              )}

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="output-format-label">{t('crypto.outputFormat')}</InputLabel>
                <Select
                  labelId="output-format-label"
                  value={outputFormat}
                  label={t('crypto.outputFormat')}
                  onChange={(e: SelectChangeEvent<OutputFormat>) => setOutputFormat(e.target.value as OutputFormat)}
                >
                  <MenuItem value="base64">Base64</MenuItem>
                  <MenuItem value="hex">Hexadecimal</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label={t('crypto.key')}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={t('crypto.placeholder.key')}
                helperText={getKeyLengthHint()}
                sx={{ flex: 1, minWidth: 250 }}
                InputProps={{
                  endAdornment: (
                    <Tooltip title={t('crypto.generateKey')}>
                      <IconButton onClick={generateRandomKey} edge="end">
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  ),
                }}
              />
              {mode !== 'ecb' && (
                <TextField
                  label={t('crypto.iv')}
                  value={iv}
                  onChange={(e) => setIv(e.target.value)}
                  placeholder={t('crypto.placeholder.iv')}
                  helperText={getIVLengthHint()}
                  sx={{ flex: 1, minWidth: 250 }}
                  InputProps={{
                    endAdornment: (
                      <Tooltip title={t('crypto.generateIV')}>
                        <IconButton onClick={generateRandomIV} edge="end">
                          <RefreshIcon />
                        </IconButton>
                      </Tooltip>
                    ),
                  }}
                />
              )}
            </Box>
          </>
        )}

        {/* Asymmetric Encryption Settings */}
        {cryptoType === 'asymmetric' && (
          <>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="rsa-key-size-label">{t('crypto.keySize')}</InputLabel>
                <Select
                  labelId="rsa-key-size-label"
                  value={rsaKeySize}
                  label={t('crypto.keySize')}
                  onChange={(e: SelectChangeEvent<number>) => setRsaKeySize(e.target.value as 2048 | 4096)}
                >
                  <MenuItem value={2048}>2048 bits</MenuItem>
                  <MenuItem value={4096}>4096 bits (更安全)</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={<VpnKeyIcon />}
                onClick={generateRSAKeyPair}
                disabled={isGeneratingKeys}
              >
                {isGeneratingKeys ? t('crypto.generating') : t('crypto.generateRSAKeys')}
              </Button>

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="output-format-label-rsa">{t('crypto.outputFormat')}</InputLabel>
                <Select
                  labelId="output-format-label-rsa"
                  value={outputFormat}
                  label={t('crypto.outputFormat')}
                  onChange={(e: SelectChangeEvent<OutputFormat>) => setOutputFormat(e.target.value as OutputFormat)}
                >
                  <MenuItem value="base64">Base64</MenuItem>
                  <MenuItem value="hex">Hexadecimal</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label={t('crypto.publicKey')}
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder={t('crypto.placeholder.publicKey')}
                multiline
                rows={4}
                sx={{ flex: 1, minWidth: 300 }}
                InputProps={{
                  sx: { fontFamily: 'monospace', fontSize: '0.85rem' }
                }}
              />
              <TextField
                label={t('crypto.privateKey')}
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder={t('crypto.placeholder.privateKey')}
                multiline
                rows={4}
                sx={{ flex: 1, minWidth: 300 }}
                InputProps={{
                  sx: { fontFamily: 'monospace', fontSize: '0.85rem' }
                }}
              />
            </Box>
          </>
        )}
      </Box>

      {/* Warning */}
      <Alert severity="warning" sx={{ mb: 3 }}>
        🔐 {cryptoType === 'symmetric' ? t('crypto.warning') : t('crypto.rsaWarning')}
      </Alert>

      {isGcmMode && (
        <Alert severity="info" sx={{ mb: 3 }}>
          ⭐ {t('crypto.gcmInfo')}
        </Alert>
      )}

      {/* Resizable Panels */}
      <ResizablePanels
        leftPanel={leftPanel}
        rightPanel={rightPanel}
        onParse={handleEncrypt}
        onSave={handleDecrypt}
        canParse={
          cryptoType === 'symmetric' 
            ? !!input && !!key 
            : !!input && !!publicKey
        }
        canSave={
          cryptoType === 'symmetric' 
            ? !!output && !!key 
            : !!output && !!privateKey
        }
      />

      {/* Usage Tips */}
      <Box sx={{ mt: 4, p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          💡 {t('crypto.info.title')}
        </Typography>
        
        {cryptoType === 'symmetric' ? (
          <>
            <Typography variant="body2" paragraph>
              {t('crypto.info.description')}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              🔒 {t('crypto.info.algorithms')}
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>AES-256:</strong> {t('crypto.info.aesDesc')}
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>DES/3DES:</strong> {t('crypto.info.desDesc')}
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>RC4:</strong> {t('crypto.info.rc4Desc')}
              </Typography>
              <Typography component="li" variant="body2">
                <strong>Rabbit:</strong> {t('crypto.info.rabbitDesc')}
              </Typography>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              ⚙️ {t('crypto.info.modes')}
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>GCM ⭐:</strong> {t('crypto.info.gcmDesc')}
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>CBC:</strong> {t('crypto.info.cbcDesc')}
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>ECB:</strong> {t('crypto.info.ecbDesc')}
              </Typography>
              <Typography component="li" variant="body2">
                {t('crypto.info.otherModes')}
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="body2" paragraph>
              {t('crypto.info.rsaDescription')}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
              🔐 {t('crypto.info.rsaFeatures')}
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>{t('crypto.info.rsaFeature1Title')}:</strong> {t('crypto.info.rsaFeature1Desc')}
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                <strong>{t('crypto.info.rsaFeature2Title')}:</strong> {t('crypto.info.rsaFeature2Desc')}
              </Typography>
              <Typography component="li" variant="body2">
                <strong>{t('crypto.info.rsaFeature3Title')}:</strong> {t('crypto.info.rsaFeature3Desc')}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}
