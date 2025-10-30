import { useState, useRef, useEffect, ReactNode } from 'react';
import { Box, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useTranslation } from 'react-i18next';

interface ResizablePanelsProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  defaultLeftWidth?: number; // percentage
  minWidth?: number; // percentage
  maxWidth?: number; // percentage
  onParse?: () => void;
  onSave?: () => void;
  canParse?: boolean;
  canSave?: boolean;
}

export default function ResizablePanels({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 50,
  minWidth = 20,
  maxWidth = 80,
  onParse,
  onSave,
  canParse = false,
  canSave = false,
}: ResizablePanelsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // md = 960px
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      let newLeftWidth: number;
      
      if (isMobile) {
        // 垂直布局：计算高度百分比
        newLeftWidth = ((e.clientY - containerRect.top) / containerRect.height) * 100;
      } else {
        // 水平布局：计算宽度百分比
        newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      }

      // Constrain width between min and max
      const constrainedWidth = Math.min(Math.max(newLeftWidth, minWidth), maxWidth);
      setLeftWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
      document.body.style.cursor = isMobile ? 'row-resize' : 'col-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, minWidth, maxWidth, isMobile]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Left/Top Panel */}
      <Box
        sx={{
          width: isMobile ? '100%' : `${leftWidth}%`,
          height: isMobile ? `${leftWidth}%` : '100%',
          flexShrink: 0,
        }}
      >
        {leftPanel}
      </Box>

      {/* Divider */}
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          width: isMobile ? '100%' : '56px',
          height: isMobile ? '56px' : '100%',
          cursor: isMobile ? 'row-resize' : 'col-resize',
          flexShrink: 0,
          alignSelf: 'stretch',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pt: isMobile ? 0 : '200px',
        }}
      >
        {/* 按钮组容器 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            px: 1,
          }}
        >
          {/* 解析按钮（向右/向下箭头） */}
          {onParse && (
            <Tooltip title={t('jsonParser.parseButton')} placement={isMobile ? 'bottom' : 'right'}>
              <span>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onParse();
                  }}
                  disabled={!canParse}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    width: 32,
                    height: 32,
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '&:disabled': {
                      backgroundColor: 'grey.300',
                      color: 'grey.500',
                    },
                  }}
                >
                  {isMobile ? (
                    <ArrowDownwardIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <ArrowForwardIcon sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          )}
          
          {/* 保存按钮（向左/向上箭头） */}
          {onSave && (
            <Tooltip title={t('jsonParser.saveButton')} placement={isMobile ? 'top' : 'left'}>
              <span>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onSave();
                  }}
                  disabled={!canSave}
                  sx={{
                    backgroundColor: 'success.main',
                    color: 'white',
                    width: 32,
                    height: 32,
                    '&:hover': {
                      backgroundColor: 'success.dark',
                    },
                    '&:disabled': {
                      backgroundColor: 'grey.300',
                      color: 'grey.500',
                    },
                  }}
                >
                  {isMobile ? (
                    <ArrowUpwardIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <ArrowBackIcon sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          )}
          
          {/* 拖拉图示 - 窄屏时隐藏 */}
          {!isMobile && (
            <DragIndicatorIcon 
              sx={{ 
                color: 'text.secondary',
                fontSize: 20,
                opacity: 0.5,
                pointerEvents: 'none',
              }} 
            />
          )}
        </Box>
      </Box>

      {/* Right/Bottom Panel */}
      <Box
        sx={{
          width: isMobile ? '100%' : `${100 - leftWidth}%`,
          height: isMobile ? `${100 - leftWidth}%` : '100%',
          flexGrow: 1,
        }}
      >
        {rightPanel}
      </Box>
    </Box>
  );
}

