import { useState, useRef, useEffect } from 'react';
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
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import CloseIcon from '@mui/icons-material/Close';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useTranslation } from 'react-i18next';
import JSZip from 'jszip';
import imageCompression from 'browser-image-compression';
import Compressor from 'compressorjs';
import UPNG from 'upng-js';

interface ImageFile {
  id: string;
  name: string;
  originalFile: File;
  originalDataUrl: string;
  originalSize: number;
  compressedImages: { [key: string]: string };
  sizes: { [key: string]: number };
}

type Platform = 'android' | 'ios' | null;
type OutputFormat = 'jpeg' | 'png' | 'webp';

// Android 解析度比例
const ANDROID_DENSITIES = {
  'hdpi': 1.5,
  'xhdpi': 2.0,
  'xxhdpi': 3.0,
  'xxxhdpi': 4.0,
};

// iOS 解析度比例
const IOS_SCALES = {
  '@1x': 1.0,
  '@2x': 2.0,
  '@3x': 3.0,
};

export default function ImageCompressorPage() {
  const { t } = useTranslation();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [quality, setQuality] = useState<number>(80);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [platform, setPlatform] = useState<Platform>(null);
  const [baseResolution, setBaseResolution] = useState<string>('xxxhdpi');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 页面加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 當輸出格式、品質、平台或基準解析度改變時，重新處理所有圖片
  useEffect(() => {
    if (images.length > 0) {
      reprocessAllImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputFormat, quality, platform, baseResolution]);

  const reprocessAllImages = async () => {
    if (images.length === 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const updatedImages = await Promise.all(
        images.map(async (img) => {
          try {
            if (platform) {
              // 創建新的對象，避免修改原始對象
              const newImageFile: ImageFile = {
                ...img,
                compressedImages: {},
                sizes: {},
              };
              return await processImageForPlatform(newImageFile, img.originalDataUrl, quality, outputFormat);
            } else {
              const compressed = await compressImage(img.originalDataUrl, quality, 1, outputFormat);
              return {
                ...img,
                compressedDataUrl: compressed.dataUrl,
                compressedSize: compressed.size,
                compressedImages: {
                  [outputFormat]: compressed.dataUrl,
                },
                sizes: {
                  [outputFormat]: compressed.size,
                },
              };
            }
          } catch (error) {
            console.error('Error reprocessing image:', error);
            return img;
          }
        })
      );
      
      setImages(updatedImages);
    } catch (error) {
      console.error('Error in reprocessAllImages:', error);
      setError(String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    processFiles(Array.from(files));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const processFiles = (files: File[]) => {
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      setError(t('imageCompressor.upload.error'));
      return;
    }

    setError('');
    setLoading(true);

    const newImages: ImageFile[] = [];
    let processed = 0;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const imageFile: ImageFile = {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          originalFile: file,
          originalDataUrl: result,
          originalSize: file.size,
          compressedImages: {},
          sizes: {},
        };

        if (platform) {
          processImageForPlatform(imageFile, result, quality, outputFormat).then((processedImage) => {
            newImages.push(processedImage);
            processed++;
            if (processed === validFiles.length) {
              setImages((prev) => [...prev, ...newImages]);
              setLoading(false);
            }
          });
        } else {
          compressImage(result, quality, 1, outputFormat).then(({ dataUrl, size }) => {
            imageFile.compressedImages[outputFormat] = dataUrl;
            imageFile.sizes[outputFormat] = size;
            newImages.push(imageFile);
            processed++;
            if (processed === validFiles.length) {
              setImages((prev) => [...prev, ...newImages]);
              setLoading(false);
            }
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const compressImage = async (imageSrc: string, quality: number, scale: number = 1, format: OutputFormat = 'jpeg'): Promise<{ dataUrl: string; size: number }> => {
    try {
      // PNG 格式使用 UPNG.js 進行高質量壓縮
      if (format === 'png') {
        return await compressWithUPNG(imageSrc, quality, scale);
      }
      
      // JPEG 使用 Compressor.js
      if (format === 'jpeg') {
        return await compressWithCompressorJS(imageSrc, quality, scale, 'jpeg');
      }
      
      // WebP 使用 browser-image-compression（跨瀏覽器支援）
      if (format === 'webp') {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const file = new File([blob], 'image.webp', { type: 'image/webp' });

        const options = {
          maxSizeMB: 10,
          maxWidthOrHeight: Math.round(4096 * scale),
          useWebWorker: true,
          quality: quality / 100,
          fileType: 'image/webp' as any,
          initialQuality: quality / 100,
        };

        const compressedFile = await imageCompression(file, options);
        
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              dataUrl: reader.result as string,
              size: compressedFile.size,
            });
          };
          reader.readAsDataURL(compressedFile);
        });
      }
      
      return fallbackCompression(imageSrc, quality, scale, format);
    } catch (error) {
      console.error('Compression error:', error);
      return fallbackCompression(imageSrc, quality, scale, format);
    }
  };

  // 使用 UPNG.js 壓縮 PNG（量化色彩以實現更高壓縮率）
  const compressWithUPNG = async (imageSrc: string, quality: number, scale: number = 1): Promise<{ dataUrl: string; size: number }> => {
    return new Promise(async (resolve, reject) => {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageSrc;
        
        await new Promise((res, rej) => {
          img.onload = res;
          img.onerror = rej;
        });
        
        // 創建 canvas 並調整大小
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        const targetWidth = Math.round(img.width * scale);
        const targetHeight = Math.round(img.height * scale);
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        // 獲取圖像數據
        const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const rgba = imageData.data;
        
        // 根據品質計算色彩數量（色彩量化）
        // 品質越低，使用的色彩越少，壓縮率越高
        let colors = 256;
        if (quality < 100) {
          colors = Math.max(2, Math.floor((quality / 100) * 256));
        }
        
        // 使用 UPNG 編碼，進行色彩量化
        const compressed = UPNG.encode([rgba.buffer], targetWidth, targetHeight, colors);
        const blob = new Blob([compressed], { type: 'image/png' });
        
        // 轉換為 data URL
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            dataUrl: reader.result as string,
            size: blob.size,
          });
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('UPNG compression failed:', error);
        reject(error);
      }
    });
  };

  // 使用 Compressor.js 壓縮（支援 PNG 和 JPEG）
  const compressWithCompressorJS = async (imageSrc: string, quality: number, scale: number = 1, mimeType: 'png' | 'jpeg'): Promise<{ dataUrl: string; size: number }> => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        
        // 計算目標寬度和高度
        const img = new Image();
        img.src = imageSrc;
        await new Promise(res => img.onload = res);
        
        const targetWidth = scale !== 1 ? Math.round(img.width * scale) : undefined;
        const targetHeight = scale !== 1 ? Math.round(img.height * scale) : undefined;
        
        new Compressor(blob, {
          quality: quality / 100,
          mimeType: `image/${mimeType}`,
          width: targetWidth,
          height: targetHeight,
          strict: true,
          checkOrientation: true,
          retainExif: false,
          success(result) {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                dataUrl: reader.result as string,
                size: result.size,
              });
            };
            reader.readAsDataURL(result);
          },
          error(err) {
            console.error('Compressor.js error:', err);
            reject(err);
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  // 備用壓縮方法
  const fallbackCompression = (imageSrc: string, quality: number, scale: number = 1, format: OutputFormat = 'jpeg'): Promise<{ dataUrl: string; size: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { alpha: format !== 'jpeg' });

        const newWidth = Math.round(img.width * scale);
        const newHeight = Math.round(img.height * scale);

        canvas.width = newWidth;
        canvas.height = newHeight;

        if (format === 'jpeg') {
          ctx!.fillStyle = '#FFFFFF';
          ctx!.fillRect(0, 0, newWidth, newHeight);
        }

        ctx?.drawImage(img, 0, 0, newWidth, newHeight);

        const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'png' ? 'image/png' : 'image/webp';
        const qualityValue = quality / 100;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = () => {
                resolve({
                  dataUrl: reader.result as string,
                  size: blob.size,
                });
              };
              reader.readAsDataURL(blob);
            }
          },
          mimeType,
          qualityValue
        );
      };
      img.src = imageSrc;
    });
  };

  const processImageForPlatform = async (imageFile: ImageFile, imageSrc: string, quality: number, format: OutputFormat = 'jpeg'): Promise<ImageFile> => {
    const densities = platform === 'android' ? ANDROID_DENSITIES : IOS_SCALES;
    const baseScale = platform === 'android' ? ANDROID_DENSITIES[baseResolution as keyof typeof ANDROID_DENSITIES] : IOS_SCALES['@3x'];

    // 清空舊的壓縮數據，避免不同平台的數據混合
    imageFile.compressedImages = {};
    imageFile.sizes = {};

    for (const [key, targetScale] of Object.entries(densities)) {
      const scale = targetScale / baseScale;
      const { dataUrl, size } = await compressImage(imageSrc, quality, scale, format);
      imageFile.compressedImages[key] = dataUrl;
      imageFile.sizes[key] = size;
    }

    return imageFile;
  };

  const handleQualityChange = (_: Event, newValue: number | number[]) => {
    const newQuality = newValue as number;
    setQuality(newQuality);
  };

  const handlePlatformChange = (_: React.MouseEvent<HTMLElement>, newPlatform: Platform) => {
    setPlatform(newPlatform);
    if (newPlatform === 'ios') {
      setBaseResolution('@3x');
    } else if (newPlatform === 'android') {
      setBaseResolution('xxxhdpi');
    }
    // 切換平台時重新處理圖片
    if (images.length > 0) {
      setTimeout(() => reprocessAllImages(), 0);
    }
  };

  const handleBaseResolutionChange = (_: React.MouseEvent<HTMLElement>, newResolution: string) => {
    if (newResolution) {
      setBaseResolution(newResolution);
      // 切換基準解析度時重新處理圖片
      if (images.length > 0 && platform) {
        setTimeout(() => reprocessAllImages(), 0);
      }
    }
  };

  const handleOutputFormatChange = (_: React.MouseEvent<HTMLElement>, newFormat: OutputFormat) => {
    if (newFormat) {
      setOutputFormat(newFormat);
    }
  };

  const getFileExtension = () => {
    return outputFormat === 'jpeg' ? 'jpg' : outputFormat;
  };

  const handleDownload = async (imageFile: ImageFile) => {
    if (!platform) {
      // 單張下載 - 使用當前的輸出格式
      const firstKey = Object.keys(imageFile.compressedImages)[0];
      const dataUrl = imageFile.compressedImages[firstKey] || imageFile.compressedImages['default'];
      
      if (!dataUrl) {
        console.error('No compressed image data found');
        return;
      }
      
      const link = document.createElement('a');
      link.href = dataUrl;
      const baseName = imageFile.name.replace(/\.[^/.]+$/, '');
      link.download = `compressed-${baseName}.${getFileExtension()}`;
      link.click();
    } else {
      // 打包成 zip 下載
      const zip = new JSZip();
      const baseName = imageFile.name.replace(/\.[^/.]+$/, '');
      const ext = getFileExtension();
      
      for (const [key, dataUrl] of Object.entries(imageFile.compressedImages)) {
        const base64Data = dataUrl.split(',')[1];
        const folderName = platform === 'android' ? `drawable-${key}` : '';
        const fileName = platform === 'android' 
          ? `${baseName}.${ext}`
          : `${baseName}${key}.${ext}`;
        
        if (folderName) {
          zip.folder(folderName)?.file(fileName, base64Data, { base64: true });
        } else {
          zip.file(fileName, base64Data, { base64: true });
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${baseName}-${platform}.zip`;
      link.click();
    }
  };

  const handleDownloadAll = async () => {
    if (images.length === 0) return;

    const zip = new JSZip();
    const ext = getFileExtension();

    for (const imageFile of images) {
      const baseName = imageFile.name.replace(/\.[^/.]+$/, '');

      if (!platform) {
        const base64Data = imageFile.compressedImages['default'].split(',')[1];
        zip.file(`${baseName}.${ext}`, base64Data, { base64: true });
      } else {
        for (const [key, dataUrl] of Object.entries(imageFile.compressedImages)) {
          const base64Data = dataUrl.split(',')[1];
          const folderName = platform === 'android' ? `drawable-${key}` : '';
          const fileName = platform === 'android' 
            ? `${baseName}.${ext}`
            : `${baseName}${key}.${ext}`;
          
          if (folderName) {
            zip.folder(folderName)?.file(fileName, base64Data, { base64: true });
          } else {
            zip.folder(baseName)?.file(fileName, base64Data, { base64: true });
          }
        }
      }
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `compressed-images-${Date.now()}.zip`;
    link.click();
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleClear = () => {
    setImages([]);
    setQuality(80);
    setError('');
    setPlatform(null);
    setOutputFormat('jpeg');
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

  const getTotalOriginalSize = () => {
    return images.reduce((sum, img) => sum + img.originalSize, 0);
  };

  const getTotalCompressedSize = () => {
    return images.reduce((sum, img) => {
      const sizes = Object.values(img.sizes);
      return sum + (sizes.length > 0 ? sizes[0] : 0);
    }, 0);
  };

  const compressionRatio = getTotalOriginalSize() > 0
    ? Math.round(((getTotalOriginalSize() - getTotalCompressedSize()) / getTotalOriginalSize()) * 100)
    : 0;

  // 計算單張圖片的壓縮比例
  const getImageCompressionRatio = (imageFile: ImageFile): number => {
    const firstCompressedKey = Object.keys(imageFile.compressedImages)[0];
    const compressedSize = imageFile.sizes[firstCompressedKey] || 0;
    if (imageFile.originalSize > 0 && compressedSize > 0) {
      return Math.round(((imageFile.originalSize - compressedSize) / imageFile.originalSize) * 100);
    }
    return 0;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', gap: 3 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 2,
            backgroundColor: '#E89C5C20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#E89C5C',
            flexShrink: 0,
          }}
        >
          <ImageIcon sx={{ fontSize: '2rem' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            {t('imageCompressor.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('imageCompressor.description')}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* 1. Platform Selection */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          1. {t('imageCompressor.platform.title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <ToggleButtonGroup
            value={platform}
            exclusive
            onChange={handlePlatformChange}
            aria-label="platform selection"
          >
            <ToggleButton value={null}>
              <ImageIcon sx={{ mr: 1 }} />
              {t('imageCompressor.platform.normal')}
            </ToggleButton>
            <ToggleButton value="android">
              <AndroidIcon sx={{ mr: 1 }} />
              Android
            </ToggleButton>
            <ToggleButton value="ios">
              <AppleIcon sx={{ mr: 1 }} />
              iOS
            </ToggleButton>
          </ToggleButtonGroup>

          {platform && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('imageCompressor.platform.baseResolution')}
              </Typography>
              <ToggleButtonGroup
                value={baseResolution}
                exclusive
                onChange={handleBaseResolutionChange}
                size="small"
              >
                {platform === 'android' ? (
                  Object.keys(ANDROID_DENSITIES).map((density) => (
                    <ToggleButton key={density} value={density}>
                      {density}
                    </ToggleButton>
                  ))
                ) : (
                  Object.keys(IOS_SCALES).map((scale) => (
                    <ToggleButton key={scale} value={scale}>
                      {scale}
                    </ToggleButton>
                  ))
                )}
              </ToggleButtonGroup>
            </Box>
          )}
        </Box>
        {platform && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {platform === 'android' 
              ? t('imageCompressor.platform.androidInfo')
              : t('imageCompressor.platform.iosInfo')}
          </Alert>
        )}
      </Paper>

      {/* 2. Output Format Selection */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          2. {t('imageCompressor.format.title')}
        </Typography>
        <ToggleButtonGroup
          value={outputFormat}
          exclusive
          onChange={handleOutputFormatChange}
          aria-label="output format selection"
          fullWidth
        >
          <ToggleButton value="png">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>PNG</Typography>
              <Typography variant="caption" color="text.secondary">
                {t('imageCompressor.format.pngDesc')}
              </Typography>
            </Box>
          </ToggleButton>
          <ToggleButton value="webp">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>WebP</Typography>
              <Typography variant="caption" color="text.secondary">
                {t('imageCompressor.format.webpDesc')}
              </Typography>
            </Box>
          </ToggleButton>
          <ToggleButton value="jpeg">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>JPEG</Typography>
              <Typography variant="caption" color="text.secondary">
                {t('imageCompressor.format.jpegDesc')}
              </Typography>
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      {/* 3. Quality Control */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          3. {t('imageCompressor.compression.quality', { quality })}
        </Typography>
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

      {loading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
            {t('imageCompressor.processing')}
          </Typography>
        </Box>
      )}

      {/* Images Summary */}
      {images.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {t('imageCompressor.summary.title')} ({images.length} {t('imageCompressor.summary.images')})
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('imageCompressor.compression.originalSize')}{formatSize(getTotalOriginalSize())} → {t('imageCompressor.compression.compressedSize')}{formatSize(getTotalCompressedSize())}
                {compressionRatio > 0 && (
                  <Typography component="span" color="success.main" sx={{ ml: 1, fontWeight: 600 }}>
                    {t('imageCompressor.compression.reduction', { ratio: compressionRatio })}
                  </Typography>
                )}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, newMode) => newMode && setViewMode(newMode)}
                size="small"
              >
                <ToggleButton value="grid">
                  <GridViewIcon />
                </ToggleButton>
                <ToggleButton value="list">
                  <ViewListIcon />
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadAll}
                disabled={loading}
              >
                {t('imageCompressor.buttons.downloadAll')}
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
        </Paper>
      )}

      {/* Image Cards */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {images.map((imageFile) => {
            const firstCompressedKey = Object.keys(imageFile.compressedImages)[0];
            const firstCompressedImage = imageFile.compressedImages[firstCompressedKey];
            const totalResolutions = Object.keys(imageFile.compressedImages).length;
            const compressionRatio = getImageCompressionRatio(imageFile);

            return (
              <Grid item xs={12} sm={6} md={4} key={imageFile.id}>
                <Card>
                  <Box 
                    sx={{ position: 'relative', cursor: 'pointer' }}
                    onClick={() => setPreviewImage({ url: firstCompressedImage || imageFile.originalDataUrl, name: imageFile.name })}
                  >
                    <Box
                      component="img"
                      src={firstCompressedImage || imageFile.originalDataUrl}
                      alt={imageFile.name}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        backgroundColor: 'grey.100',
                      }}
                    />
                    {compressionRatio > 0 && (
                      <Chip
                        label={`-${compressionRatio}%`}
                        color="success"
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          left: 8,
                          fontWeight: 600,
                        }}
                      />
                    )}
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        },
                      }}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(imageFile.id);
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <CardContent>
                    <Typography variant="subtitle2" noWrap gutterBottom title={imageFile.name}>
                      {imageFile.name}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {t('imageCompressor.preview.original')}: {formatSize(imageFile.originalSize)}
                      </Typography>
                      {firstCompressedKey && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          {t('imageCompressor.preview.compressed')}: {formatSize(imageFile.sizes[firstCompressedKey])}
                        </Typography>
                      )}
                    </Box>
                    {platform && totalResolutions > 1 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                          {t('imageCompressor.resolutions')}:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {Object.keys(imageFile.compressedImages).map((key) => (
                            <Chip key={key} label={key} size="small" />
                          ))}
                        </Box>
                      </Box>
                    )}
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(imageFile)}
                      size="small"
                    >
                      {t('imageCompressor.buttons.download')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box>
          {images.map((imageFile) => {
            const firstCompressedKey = Object.keys(imageFile.compressedImages)[0];
            const firstCompressedImage = imageFile.compressedImages[firstCompressedKey];
            const totalResolutions = Object.keys(imageFile.compressedImages).length;
            const compressionRatio = getImageCompressionRatio(imageFile);

            return (
              <Card key={imageFile.id} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', p: 2, gap: 2 }}>
                  <Box 
                    sx={{ 
                      position: 'relative',
                      width: 120, 
                      height: 120, 
                      flexShrink: 0,
                      cursor: 'pointer',
                    }}
                    onClick={() => setPreviewImage({ url: firstCompressedImage || imageFile.originalDataUrl, name: imageFile.name })}
                  >
                    <Box
                      component="img"
                      src={firstCompressedImage || imageFile.originalDataUrl}
                      alt={imageFile.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 1,
                        backgroundColor: 'grey.100',
                      }}
                    />
                    {compressionRatio > 0 && (
                      <Chip
                        label={`-${compressionRatio}%`}
                        color="success"
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 4,
                          left: 4,
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography variant="subtitle1" noWrap title={imageFile.name} sx={{ fontWeight: 600 }}>
                        {imageFile.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(imageFile.id)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {t('imageCompressor.preview.original')}: {formatSize(imageFile.originalSize)}
                      </Typography>
                      {firstCompressedKey && (
                        <Typography variant="body2" color="text.secondary">
                          {t('imageCompressor.preview.compressed')}: {formatSize(imageFile.sizes[firstCompressedKey])}
                        </Typography>
                      )}
                    </Box>
                    {platform && totalResolutions > 1 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                          {t('imageCompressor.resolutions')}:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {Object.keys(imageFile.compressedImages).map((key) => (
                            <Chip key={key} label={key} size="small" />
                          ))}
                        </Box>
                      </Box>
                    )}
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(imageFile)}
                      size="small"
                    >
                      {t('imageCompressor.buttons.download')}
                    </Button>
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Upload Section */}
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          border: '2px dashed',
          borderColor: 'divider',
          backgroundColor: 'grey.50',
          cursor: 'pointer',
          transition: 'all 0.3s',
          mt: 3,
          mb: 3,
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'primary.50',
          },
        }}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
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
          multiple
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      </Paper>

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
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            {t('imageCompressor.tips.tip4')}
          </Typography>
          <Typography component="li" variant="body2">
            {t('imageCompressor.tips.tip5')}
          </Typography>
        </Box>
      </Paper>

      {/* Preview Dialog */}
      <Dialog
        open={previewImage !== null}
        onClose={() => setPreviewImage(null)}
        maxWidth="lg"
        fullWidth
      >
        {previewImage && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{previewImage.name}</Typography>
                <IconButton onClick={() => setPreviewImage(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box
                component="img"
                src={previewImage.url}
                alt={previewImage.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                }}
              />
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
}