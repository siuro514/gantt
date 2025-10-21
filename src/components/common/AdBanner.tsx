import { Box, Card, IconButton, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';

interface AdBannerProps {
  adSlot?: string; // Google AdSense 或其他平台的广告位 ID
  adClient?: string; // Google AdSense 客户端 ID
  adFormat?: string; // 广告格式
  style?: React.CSSProperties;
}

const AD_CLOSED_KEY = 'adBannerClosed';
const AD_CLOSED_TIME_KEY = 'adBannerClosedTime';
const SHOW_AGAIN_DELAY = 24 * 60 * 60 * 1000; // 24 小时

export default function AdBanner({ 
  adSlot, 
  adClient = 'ca-pub-xxxxxxxxxxxxxxxx', // 替换为你的 AdSense 客户端 ID
  adFormat = 'auto',
  style 
}: AdBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 检查广告是否被关闭
    const closedTime = localStorage.getItem(AD_CLOSED_TIME_KEY);
    if (closedTime) {
      const elapsed = Date.now() - parseInt(closedTime, 10);
      if (elapsed < SHOW_AGAIN_DELAY) {
        setVisible(false);
        return;
      }
    }
    setVisible(true);
  }, []);

  useEffect(() => {
    // 如果使用 Google AdSense，动态加载广告脚本
    if (visible && adSlot) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [visible, adSlot]);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem(AD_CLOSED_TIME_KEY, Date.now().toString());
  };

  if (!visible) return null;

  return (
    <Fade in={visible}>
      <Card
        elevation={2}
        sx={{
          position: 'relative',
          p: 2,
          mt: 2,
          mx: 2,
          mb: 2,
          backgroundColor: 'background.paper',
          borderRadius: 3,
          overflow: 'visible',
          ...style,
        }}
      >
        {/* 关闭按钮 */}
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {/* 广告内容区域 */}
        <Box
          sx={{
            minHeight: 90,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {adSlot ? (
            // Google AdSense 广告
            <ins
              className="adsbygoogle"
              style={{ display: 'block', ...style }}
              data-ad-client={adClient}
              data-ad-slot={adSlot}
              data-ad-format={adFormat}
              data-full-width-responsive="true"
            />
          ) : (
            // 占位内容（在没有广告 ID 时显示）
            <Box
              sx={{
                width: '100%',
                height: 90,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                borderRadius: 2,
                border: '1px dashed',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                <Box sx={{ fontSize: '0.875rem', mb: 0.5 }}>广告位</Box>
                <Box sx={{ fontSize: '0.75rem' }}>
                  请在 AdBanner 组件中配置 adSlot 和 adClient
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Card>
    </Fade>
  );
}

