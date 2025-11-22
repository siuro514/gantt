import { useState, useRef, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Slider,
  Alert,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import heic2any from 'heic2any';
import CloseIcon from '@mui/icons-material/Close';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
  processing: boolean;
  progress: number;
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
  const [error, setError] = useState('');
  const [platform, setPlatform] = useState<Platform>(null);
  const [baseResolution, setBaseResolution] = useState<string>('xxxhdpi');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
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
    
    // 重置所有圖片的處理狀態
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        processing: true,
        progress: 0,
        compressedImages: {},
        sizes: {},
      }))
    );
    
    setError('');
    
    try {
      // 異步處理每個圖片
      images.forEach(async (img) => {
        try {
          if (platform) {
            const processedImage = await processImageForPlatformWithProgress(
              img.id,
              img.originalDataUrl,
              img.name,
              img.originalFile,
              img.originalSize,
              quality,
              outputFormat,
              platform,
              baseResolution
            );
            
            setImages((prev) =>
              prev.map((image) =>
                image.id === img.id ? processedImage : image
              )
            );
          } else {
            setImages((prev) =>
              prev.map((image) =>
                image.id === img.id ? { ...image, progress: 10 } : image
              )
            );
            
            const compressed = await compressImage(img.originalDataUrl, quality, 1, outputFormat);
            
            setImages((prev) =>
              prev.map((image) =>
                image.id === img.id
                  ? {
                      ...image,
                      compressedImages: { [outputFormat]: compressed.dataUrl },
                      sizes: { [outputFormat]: compressed.size },
                      processing: false,
                      progress: 100,
                    }
                  : image
              )
            );
          }
        } catch (error) {
          console.error('Error reprocessing image:', error);
          setImages((prev) =>
            prev.map((image) =>
              image.id === img.id ? { ...image, processing: false, progress: 0 } : image
            )
          );
        }
      });
    } catch (error) {
      console.error('Error in reprocessAllImages:', error);
      setError(String(error));
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

  const processFiles = async (files: File[]) => {
    const validFiles: File[] = [];
    const originalSizes: number[] = []; // 保存原始檔案大小
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = file.name.toLowerCase();
      const isHEIC = fileName.endsWith('.heic') || fileName.endsWith('.heif') || 
                     file.type === 'image/heic' || file.type === 'image/heif';
      
      if (isHEIC) {
        try {
          // 保存原始 HEIC 檔案大小
          const originalSize = file.size;
          
          // 將 HEIC 轉換為 PNG
          const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/png',
            quality: 1
          });
          
          // heic2any 可能返回 Blob 或 Blob[]
          const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          
          // 創建一個新的 File 對象
          const convertedFile = new File(
            [blob], 
            file.name.replace(/\.(heic|heif)$/i, '.png'), 
            { type: 'image/png' }
          );
          
          validFiles.push(convertedFile);
          originalSizes.push(originalSize); // 使用原始 HEIC 大小
        } catch (error) {
          console.error('HEIC conversion error:', error);
          setError(`Failed to convert ${file.name}`);
        }
      } else if (file.type.startsWith('image/')) {
        validFiles.push(file);
        originalSizes.push(file.size); // 使用實際檔案大小
      }
    }

    if (validFiles.length === 0) {
      setError(t('imageCompressor.upload.error'));
      return;
    }

    setError('');

    // 立即創建圖片條目並添加到列表中
    const newImages: ImageFile[] = validFiles.map((file, index) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      originalFile: file,
      originalDataUrl: '',
      originalSize: originalSizes[index], // 使用保存的原始大小
      compressedImages: {},
      sizes: {},
      processing: true,
      progress: 0,
    }));

    setImages((prev) => [...prev, ...newImages]);

    // 異步處理每個圖片
    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        const imageId = newImages[index].id;
        
        // 更新 originalDataUrl
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, originalDataUrl: result, progress: 10 } : img
          )
        );

        try {
          if (platform) {
            const processedImage = await processImageForPlatformWithProgress(
              imageId,
              result,
              file.name,
              file,
              file.size,
              quality,
              outputFormat,
              platform,
              baseResolution
            );
            
            setImages((prev) =>
              prev.map((img) =>
                img.id === imageId ? processedImage : img
              )
            );
          } else {
            const compressed = await compressImage(result, quality, 1, outputFormat);
            
            setImages((prev) =>
              prev.map((img) =>
                img.id === imageId
                  ? {
                      ...img,
                      compressedImages: { [outputFormat]: compressed.dataUrl },
                      sizes: { [outputFormat]: compressed.size },
                      processing: false,
                      progress: 100,
                    }
                  : img
              )
            );
          }
        } catch (error) {
          console.error('Error processing image:', error);
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageId ? { ...img, processing: false, progress: 0 } : img
            )
          );
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

  const processImageForPlatformWithProgress = async (
    imageId: string,
    imageSrc: string,
    name: string,
    originalFile: File,
    originalSize: number,
    quality: number,
    format: OutputFormat,
    currentPlatform: Platform,
    currentBaseResolution: string
  ): Promise<ImageFile> => {
    const densities = currentPlatform === 'android' ? ANDROID_DENSITIES : IOS_SCALES;
    const baseScale = currentPlatform === 'android' 
      ? ANDROID_DENSITIES[currentBaseResolution as keyof typeof ANDROID_DENSITIES] 
      : IOS_SCALES[currentBaseResolution as keyof typeof IOS_SCALES];

    const compressedImages: { [key: string]: string } = {};
    const sizes: { [key: string]: number } = {};
    const totalSteps = Object.keys(densities).length;
    let currentStep = 0;

    for (const [key, targetScale] of Object.entries(densities)) {
      const scale = targetScale / baseScale;
      const { dataUrl, size } = await compressImage(imageSrc, quality, scale, format);
      compressedImages[key] = dataUrl;
      sizes[key] = size;
      
      currentStep++;
      const progress = 10 + Math.round((currentStep / totalSteps) * 90);
      
      // 更新進度
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId ? { ...img, progress } : img
        )
      );
    }

    return {
      id: imageId,
      name,
      originalFile,
      originalDataUrl: imageSrc,
      originalSize,
      compressedImages,
      sizes,
      processing: false,
      progress: 100,
    };
  };

  const handleQualityChange = (_: Event, newValue: number | number[]) => {
    const newQuality = Math.max(10, Math.min(100, newValue as number));
    setQuality(newQuality);
  };

  const handlePlatformChange = (_: React.MouseEvent<HTMLElement>, newPlatform: Platform | 'normal') => {
    if (newPlatform === null) {
      // 點擊已選擇的按鈕時，不做任何改變
      return;
    }
    
    if (newPlatform === 'normal') {
      setPlatform(null);
    } else {
      setPlatform(newPlatform);
      if (newPlatform === 'ios') {
        setBaseResolution('@3x');
      } else if (newPlatform === 'android') {
        setBaseResolution('xxxhdpi');
      }
    }
    // useEffect 會自動重新處理圖片
  };

  const handleBaseResolutionChange = (_: React.MouseEvent<HTMLElement>, newResolution: string) => {
    if (newResolution) {
      setBaseResolution(newResolution);
      // useEffect 會自動重新處理圖片
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

  const handleStartEdit = (imageFile: ImageFile) => {
    setEditingImageId(imageFile.id);
    setEditingName(imageFile.name);
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
      // 如果有平台設定，使用基準解析度；否則使用第一個 key
      const displayKey = platform ? baseResolution : Object.keys(img.compressedImages)[0];
      const size = img.sizes[displayKey] || Object.values(img.sizes)[0] || 0;
      return sum + size;
    }, 0);
  };

  const compressionRatio = getTotalOriginalSize() > 0
    ? Math.round(((getTotalOriginalSize() - getTotalCompressedSize()) / getTotalOriginalSize()) * 100)
    : 0;

  // 計算單張圖片的壓縮比例（與基準解析度比較）
  const getImageCompressionRatio = (imageFile: ImageFile): number => {
    // 如果有平台設定，使用基準解析度的大小來比較
    if (platform) {
      const baseKey = platform === 'android' ? baseResolution : baseResolution;
      const compressedSize = imageFile.sizes[baseKey] || 0;
      
      if (imageFile.originalSize > 0 && compressedSize > 0) {
        return Math.round(((imageFile.originalSize - compressedSize) / imageFile.originalSize) * 100);
      }
    } else {
      // 沒有平台設定時，與原始檔案比較
      const firstCompressedKey = Object.keys(imageFile.compressedImages)[0];
      const compressedSize = imageFile.sizes[firstCompressedKey] || 0;
      if (imageFile.originalSize > 0 && compressedSize > 0) {
        return Math.round(((imageFile.originalSize - compressedSize) / imageFile.originalSize) * 100);
      }
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
            value={platform || 'normal'}
            exclusive
            onChange={handlePlatformChange}
            aria-label="platform selection"
            sx={{
              '& .MuiToggleButton-root': {
                textTransform: 'none',
              }
            }}
          >
            <ToggleButton value="normal">
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
                sx={{
                  '& .MuiToggleButton-root': {
                    textTransform: 'none',
                  }
                }}
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
          sx={{
            '& .MuiToggleButton-root': {
              textTransform: 'none',
            }
          }}
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
          min={9.5}
          max={100.5}
          step={5}
          marks={[
            { value: 10, label: '10%' },
            { value: 50, label: '50%' },
            { value: 80, label: '80%' },
            { value: 100, label: '100%' },
          ]}
          valueLabelDisplay="auto"
          sx={{
            '& .MuiSlider-thumb': {
              '&:before': {
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
              },
            },
          }}
        />
      </Paper>

      {/* Images Summary */}
      {images.length > 0 && (
        <Accordion defaultExpanded sx={{ mb: 3, borderRadius: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {t('imageCompressor.summary.title')} ({images.length} {t('imageCompressor.summary.images')})
                {compressionRatio > 0 && (
                  <Chip 
                    label={t('imageCompressor.compression.reduction', { ratio: compressionRatio })}
                    color="success"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(_, newMode) => newMode && setViewMode(newMode)}
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
                  size="small"
                >
                  {t('imageCompressor.buttons.downloadAll')}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={handleClear}
                  size="small"
                >
                  {t('imageCompressor.buttons.clear')}
                </Button>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>

      {/* Image Cards */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {images.map((imageFile) => {
            const firstCompressedKey = Object.keys(imageFile.compressedImages)[0];
            const totalResolutions = Object.keys(imageFile.compressedImages).length;
            const compressionRatio = getImageCompressionRatio(imageFile);
            const isEditing = editingImageId === imageFile.id;
            
            // 如果有平台設定，使用基準解析度；否則使用第一個 key
            const displayKey = platform ? baseResolution : firstCompressedKey;
            const displaySize = imageFile.sizes[displayKey] || imageFile.sizes[firstCompressedKey] || 0;
            const displayImage = imageFile.compressedImages[displayKey] || imageFile.compressedImages[firstCompressedKey] || imageFile.originalDataUrl;

            return (
              <Grid item xs={12} sm={6} md={4} key={imageFile.id}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                  <Box 
                    sx={{ position: 'relative', cursor: imageFile.processing ? 'default' : 'pointer' }}
                    onClick={() => !imageFile.processing && setPreviewImage({ url: displayImage, name: imageFile.name })}
                  >
                    <Box
                      component="img"
                      src={displayImage || imageFile.originalDataUrl}
                      alt={imageFile.name}
                      sx={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        backgroundColor: 'grey.100',
                        opacity: imageFile.processing ? 0.6 : 1,
                      }}
                    />
                    {imageFile.processing && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}
                      >
                        <CircularProgress size={40} sx={{ mb: 2 }} />
                        <Typography variant="body2" color="white" fontWeight={600}>
                          {imageFile.progress}%
                        </Typography>
                      </Box>
                    )}
                    {!imageFile.processing && compressionRatio > 0 && (
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
                    {/* 檔名編輯區 */}
                    <Box sx={{ mb: 1 }}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => {
                            setEditingName(e.target.value);
                            setImages((prev) =>
                              prev.map((img) =>
                                img.id === imageFile.id ? { ...img, name: e.target.value } : img
                              )
                            );
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === 'Escape') {
                              setEditingImageId(null);
                            }
                          }}
                          onBlur={() => setEditingImageId(null)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: 'none',
                            borderBottom: '2px solid #1976d2',
                            borderRadius: '4px 4px 0 0',
                            fontSize: '0.875rem',
                            fontFamily: 'inherit',
                            backgroundColor: '#f5f5f5',
                            outline: 'none',
                            transition: 'all 0.2s',
                          }}
                          autoFocus
                        />
                      ) : (
                        <Typography 
                          variant="subtitle2" 
                          noWrap 
                          sx={{ 
                            cursor: 'pointer',
                            px: 1.5,
                            py: 1,
                            borderRadius: 1,
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            }
                          }} 
                          title={imageFile.name}
                          onClick={() => handleStartEdit(imageFile)}
                        >
                          {imageFile.name}
                        </Typography>
                      )}
                    </Box>

                    {/* 檔案大小資訊 */}
                    <Box sx={{ mb: 1, px: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {formatSize(imageFile.originalSize)}
                        </Typography>
                        {displaySize > 0 && (
                          <>
                            <Typography variant="body2" color="text.secondary">→</Typography>
                            <Typography variant="body2" fontWeight={600} color="success.main">
                              {formatSize(displaySize)}
                            </Typography>
                            {platform && (
                              <Chip 
                                label={displayKey} 
                                size="small" 
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.65rem',
                                  bgcolor: 'grey.200',
                                  '& .MuiChip-label': { px: 0.75, py: 0 }
                                }} 
                              />
                            )}
                          </>
                        )}
                      </Box>
                    </Box>

                    {/* 解析度詳細資訊 */}
                    {platform && totalResolutions > 1 && (
                      <Box sx={{ mb: 2, px: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                          {Object.entries(imageFile.compressedImages).map(([key, _]) => (
                            <Chip 
                              key={key}
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Chip 
                                    label={key} 
                                    size="small" 
                                    sx={{ 
                                      height: 18, 
                                      fontSize: '0.65rem',
                                      bgcolor: 'grey.300',
                                      color: 'text.primary',
                                      '& .MuiChip-label': { px: 0.75, py: 0.5 }
                                    }} 
                                  />
                                  <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500, px: 0.75 }}>
                                    {formatSize(imageFile.sizes[key])}
                                  </Typography>
                                </Box>
                              }
                              size="small"
                              variant="outlined"
                              sx={{ height: 26, '& .MuiChip-label': { px: 0.5, py: 0.5 } }}
                            />
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
            const totalResolutions = Object.keys(imageFile.compressedImages).length;
            const compressionRatio = getImageCompressionRatio(imageFile);
            const isEditing = editingImageId === imageFile.id;
            
            // 如果有平台設定，使用基準解析度；否則使用第一個 key
            const displayKey = platform ? baseResolution : firstCompressedKey;
            const displaySize = imageFile.sizes[displayKey] || imageFile.sizes[firstCompressedKey] || 0;
            const displayImage = imageFile.compressedImages[displayKey] || imageFile.compressedImages[firstCompressedKey] || imageFile.originalDataUrl;

            return (
              <Card key={imageFile.id} elevation={0} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', p: 1.5, gap: 2 }}>
                  <Box 
                    sx={{ 
                      position: 'relative',
                      width: 100, 
                      height: 100, 
                      flexShrink: 0,
                      cursor: imageFile.processing ? 'default' : 'pointer',
                    }}
                    onClick={() => !imageFile.processing && setPreviewImage({ url: displayImage, name: imageFile.name })}
                  >
                    <Box
                      component="img"
                      src={displayImage || imageFile.originalDataUrl}
                      alt={imageFile.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 1,
                        backgroundColor: 'grey.100',
                        opacity: imageFile.processing ? 0.6 : 1,
                      }}
                    />
                    {imageFile.processing && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          borderRadius: 1,
                        }}
                      >
                        <CircularProgress size={40} sx={{ mb: 1 }} />
                        <Typography variant="body2" color="white" fontWeight={600}>
                          {imageFile.progress}%
                        </Typography>
                      </Box>
                    )}
                    {!imageFile.processing && compressionRatio > 0 && (
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
                  <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {/* 第一行：檔名、按鈕 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {/* 檔名 */}
                      <Box sx={{ minWidth: 0, flexShrink: 1 }}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => {
                              setEditingName(e.target.value);
                              setImages((prev) =>
                                prev.map((img) =>
                                  img.id === imageFile.id ? { ...img, name: e.target.value } : img
                                )
                              );
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === 'Escape') {
                                setEditingImageId(null);
                              }
                            }}
                            onBlur={() => setEditingImageId(null)}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              minWidth: '150px',
                              padding: '6px 12px',
                              border: 'none',
                              borderBottom: '2px solid #1976d2',
                              borderRadius: '4px 4px 0 0',
                              fontSize: '0.875rem',
                              fontFamily: 'inherit',
                              fontWeight: 600,
                              backgroundColor: '#f5f5f5',
                              outline: 'none',
                              transition: 'all 0.2s',
                            }}
                            autoFocus
                          />
                        ) : (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600,
                              cursor: 'pointer',
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              transition: 'all 0.2s',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              '&:hover': {
                                backgroundColor: 'action.hover',
                              }
                            }} 
                            title={imageFile.name}
                            onClick={() => handleStartEdit(imageFile)}
                          >
                            {imageFile.name}
                          </Typography>
                        )}
                      </Box>

                      {/* 刪除按鈕 */}
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(imageFile.id)}
                        sx={{ ml: 'auto', flexShrink: 0 }}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>

                    {/* 第二行：檔案大小 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {formatSize(imageFile.originalSize)}
                      </Typography>
                      {displaySize > 0 && (
                        <>
                          <Typography variant="body2" color="text.secondary">→</Typography>
                          <Typography variant="body2" fontWeight={600} color="success.main">
                            {formatSize(displaySize)}
                          </Typography>
                          {platform && (
                            <Chip 
                              label={displayKey} 
                              size="small" 
                              sx={{ 
                                height: 20, 
                                fontSize: '0.65rem',
                                bgcolor: 'grey.200',
                                '& .MuiChip-label': { px: 0.75, py: 0 }
                              }} 
                            />
                          )}
                        </>
                      )}
                    </Box>

                    {/* 第三行：解析度平鋪和下載按鈕 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
                      {platform && totalResolutions > 1 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', flex: 1 }}>
                        {Object.entries(imageFile.compressedImages).map(([key, _]) => (
                          <Chip 
                            key={key}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Chip 
                                  label={key} 
                                  size="small" 
                                  sx={{ 
                                    height: 18, 
                                    fontSize: '0.65rem',
                                    bgcolor: 'grey.300',
                                    color: 'text.primary',
                                    '& .MuiChip-label': { px: 0.75, py: 0.5 }
                                  }} 
                                />
                                <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 500, px: 0.75 }}>
                                  {formatSize(imageFile.sizes[key])}
                                </Typography>
                              </Box>
                            }
                            size="small"
                            variant="outlined"
                            sx={{ height: 26, '& .MuiChip-label': { px: 0.5, py: 0.5 } }}
                          />
                        ))}
                      </Box>
                      )}
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(imageFile)}
                        size="small"
                        sx={{ ml: 'auto', flexShrink: 0 }}
                      >
                        {t('imageCompressor.buttons.download')}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}
          </AccordionDetails>
        </Accordion>
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
          accept="image/*,.heic,.heif"
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