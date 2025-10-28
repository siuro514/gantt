import { useState, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Slider,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';

export default function ImageCompressorPage() {
  const { t } = useTranslation();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(80);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(t('imageCompressor.upload.error'));
      return;
    }

    setError('');
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setOriginalImage(result);
      compressImage(result, quality);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (imageSrc: string, quality: number) => {
    setLoading(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedSize(blob.size);
            const reader = new FileReader();
            reader.onload = () => {
              setCompressedImage(reader.result as string);
              setLoading(false);
            };
            reader.readAsDataURL(blob);
          }
        },
        'image/jpeg',
        quality / 100
      );
    };
    img.src = imageSrc;
  };

  const handleQualityChange = (_: Event, newValue: number | number[]) => {
    const newQuality = newValue as number;
    setQuality(newQuality);
    if (originalImage) {
      compressImage(originalImage, newQuality);
    }
  };

  const handleDownload = () => {
    if (!compressedImage) return;

    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = `compressed-${Date.now()}.jpg`;
    link.click();
  };

  const handleClear = () => {
    setOriginalImage(null);
    setCompressedImage(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setQuality(80);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const compressionRatio = originalSize > 0
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          🖼️ {t('imageCompressor.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('imageCompressor.description')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Upload Section */}
      {!originalImage && (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            border: '2px dashed',
            borderColor: 'divider',
            backgroundColor: 'grey.50',
            cursor: 'pointer',
            transition: 'all 0.3s',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'primary.50',
            },
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {t('imageCompressor.upload.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('imageCompressor.upload.subtitle')}
          </Typography>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </Paper>
      )}

      {/* Compression Controls */}
      {originalImage && (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {t('imageCompressor.compression.quality', { quality })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('imageCompressor.compression.originalSize')}{formatSize(originalSize)} → {t('imageCompressor.compression.compressedSize')}{formatSize(compressedSize)} 
                  {compressionRatio > 0 && (
                    <Typography component="span" color="success.main" sx={{ ml: 1, fontWeight: 600 }}>
                      {t('imageCompressor.compression.reduction', { ratio: compressionRatio })}
                    </Typography>
                  )}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  disabled={!compressedImage || loading}
                >
                  {t('imageCompressor.buttons.download')}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={handleClear}
                >
                  {t('imageCompressor.buttons.clear')}
                </Button>
              </Box>
            </Box>
            <Slider
              value={quality}
              onChange={handleQualityChange}
              min={10}
              max={100}
              step={5}
              marks={[
                { value: 10, label: '10%' },
                { value: 50, label: '50%' },
                { value: 80, label: '80%' },
                { value: 100, label: '100%' },
              ]}
              valueLabelDisplay="auto"
            />
          </Paper>

          {/* Image Preview */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('imageCompressor.preview.original')}
                </Typography>
                <Box
                  component="img"
                  src={originalImage}
                  alt="Original"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 400,
                    objectFit: 'contain',
                    backgroundColor: 'grey.100',
                    borderRadius: 1,
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t('imageCompressor.preview.size')}{formatSize(originalSize)}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('imageCompressor.preview.compressed')}
                  {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
                </Typography>
                {compressedImage && (
                  <>
                    <Box
                      component="img"
                      src={compressedImage}
                      alt="Compressed"
                      sx={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: 400,
                        objectFit: 'contain',
                        backgroundColor: 'grey.100',
                        borderRadius: 1,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {t('imageCompressor.preview.size')}{formatSize(compressedSize)}
                    </Typography>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* Usage Tips */}
      <Paper sx={{ mt: 4, p: 3, backgroundColor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          💡 {t('imageCompressor.tips.title')}
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            {t('imageCompressor.tips.tip1')}
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            {t('imageCompressor.tips.tip2')}
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            {t('imageCompressor.tips.tip3')}
          </Typography>
          <Typography component="li" variant="body2">
            {t('imageCompressor.tips.tip4')}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

