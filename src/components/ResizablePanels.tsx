import { useState, useRef, useEffect, ReactNode } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

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
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, minWidth, maxWidth]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Left Panel */}
      <Box
        sx={{
          width: `${leftWidth}%`,
          height: '100%',
          flexShrink: 0,
        }}
      >
        {leftPanel}
      </Box>

      {/* Divider */}
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          width: '56px',
          height: '100%',
          cursor: 'col-resize',
          flexShrink: 0,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: '84px',
          px: 1,
        }}
      >
        {/* 解析按钮（向右箭头） */}
        {onParse && (
          <Tooltip title={t('jsonParser.parseButton')} placement="right">
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
                  mb: 1.5,
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '&:disabled': {
                    backgroundColor: 'grey.300',
                    color: 'grey.500',
                  },
                }}
              >
                <ArrowForwardIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </span>
          </Tooltip>
        )}
        
        {/* 保存按钮（向左箭头） */}
        {onSave && (
          <Tooltip title={t('jsonParser.saveButton')} placement="left">
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
                  mb: 2.5,
                  '&:hover': {
                    backgroundColor: 'success.dark',
                  },
                  '&:disabled': {
                    backgroundColor: 'grey.300',
                    color: 'grey.500',
                  },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </span>
          </Tooltip>
        )}
        
        {/* 拖拉图示 */}
        <DragIndicatorIcon 
          sx={{ 
            color: 'text.secondary',
            fontSize: 20,
            opacity: 0.5,
            pointerEvents: 'none',
          }} 
        />
      </Box>

      {/* Right Panel */}
      <Box
        sx={{
          width: `${100 - leftWidth}%`,
          height: '100%',
          flexGrow: 1,
        }}
      >
        {rightPanel}
      </Box>
    </Box>
  );
}

