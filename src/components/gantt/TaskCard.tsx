import { Box, Card, CardContent, IconButton, Tooltip, Popover, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PaletteIcon from '@mui/icons-material/Palette';
import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Task } from '@/types/gantt.types';
import { useGanttStore } from '@/store/ganttStore';
import EditableText from '../common/EditableText';

// 與 Toolbar 相同的莫蘭迪色系（亮色 + 暗色）
const TASK_COLORS = [
  // 亮色系 (3x7)
  '#E8D5C4', '#F5E6D3', '#FFF4E0', '#E8F5E9', '#E3F2FD', '#F3E5F5', '#FCE4EC',
  '#D4C5B9', '#E8D7C3', '#FFE4B5', '#C8E6C9', '#B3E5FC', '#E1BEE7', '#F8BBD0',
  '#C9B8A8', '#DCC9B0', '#FFD89C', '#A5D6A7', '#81D4FA', '#CE93D8', '#F48FB1',
  
  // 暗色系 (3x7)
  '#8D7B68', '#A68A6A', '#B8956A', '#7D9D7F', '#6B8E9E', '#8B7E99', '#A97D88',
  '#6E5D4E', '#8A6F50', '#9A7750', '#5F7D5F', '#4A6B7C', '#6A5B7A', '#8B5E6B',
  '#574839', '#6D5940', '#7D5F42', '#4A624A', '#3A5463', '#533E5C', '#6D4450',
];

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<'left' | 'right' | null>(null);
  const [colorPickerAnchor, setColorPickerAnchor] = useState<HTMLElement | null>(null);
  const [urlDialogOpen, setUrlDialogOpen] = useState(false);
  const [urlInput, setUrlInput] = useState(task.url || '');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<HTMLElement | null>(null);
  const [isNarrow, setIsNarrow] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const parentBoxRef = useRef<HTMLElement | null>(null);
  const startXRef = useRef(0);
  const startPositionRef = useRef(0);
  const startWidthRef = useRef(0);
  const finalStartXRef = useRef(0);
  const finalWidthRef = useRef(0);

  const updateTask = useGanttStore((state) => state.updateTask);
  const deleteTask = useGanttStore((state) => state.deleteTask);
  const duplicateTask = useGanttStore((state) => state.duplicateTask);

  const { attributes, listeners, setNodeRef, transform, isDragging: isDraggingDnd } = useDraggable({
    id: task.id,
    disabled: isResizing,
  });

  const actualIsDragging = isDragging || isDraggingDnd;

  // 檢測卡片寬度
  useEffect(() => {
    if (cardRef.current) {
      const checkWidth = () => {
        const width = cardRef.current?.offsetWidth || 0;
        setIsNarrow(width < 150);
      };
      checkWidth();
      
      // 使用 ResizeObserver 監聽寬度變化
      const resizeObserver = new ResizeObserver(checkWidth);
      resizeObserver.observe(cardRef.current);
      
      return () => resizeObserver.disconnect();
    }
  }, [task.width]);

  const handleTitleChange = (newTitle: string) => {
    updateTask(task.id, { title: newTitle });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateTask(task.id);
    setIsHovered(false);
    setMoreMenuAnchor(null);
  };

  const handleMoreMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMoreMenuAnchor(e.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuAnchor(null);
  };

  const handleMoreMenuColorPicker = (e: React.MouseEvent<HTMLElement>) => {
    handleMoreMenuClose();
    handleColorPickerOpen(e);
  };

  const handleMoreMenuLink = (e: React.MouseEvent<HTMLElement>) => {
    handleMoreMenuClose();
    handleLinkClick(e);
  };

  const handleMoreMenuDuplicate = (e: React.MouseEvent<HTMLElement>) => {
    handleMoreMenuClose();
    handleDuplicate(e);
  };

  const handleColorPickerOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setColorPickerAnchor(e.currentTarget);
  };

  const handleColorPickerClose = () => {
    setColorPickerAnchor(null);
  };

  const handleColorSelect = (color: string) => {
    updateTask(task.id, { backgroundColor: color });
    handleColorPickerClose();
    setIsHovered(false); // 隱藏操作按鈕
  };

  const handleColorClear = () => {
    updateTask(task.id, { backgroundColor: undefined });
    handleColorPickerClose();
    setIsHovered(false); // 隱藏操作按鈕
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (task.url) {
      // 如果已有 URL，按住 Cmd/Ctrl 開啟連結，否則編輯
      if (e.metaKey || e.ctrlKey) {
        window.open(task.url, '_blank', 'noopener,noreferrer');
      } else {
        setUrlInput(task.url);
        setUrlDialogOpen(true);
      }
    } else {
      // 如果沒有 URL，開啟編輯
      setUrlInput('');
      setUrlDialogOpen(true);
    }
  };

  const handleUrlSave = () => {
    if (urlInput.trim()) {
      // 確保 URL 有協議
      let finalUrl = urlInput.trim();
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = 'https://' + finalUrl;
      }
      updateTask(task.id, { url: finalUrl });
    } else {
      updateTask(task.id, { url: undefined });
    }
    setUrlDialogOpen(false);
    setIsHovered(false);
  };

  const handleUrlClear = () => {
    updateTask(task.id, { url: undefined });
    setUrlDialogOpen(false);
    setIsHovered(false);
  };

  const handleResizeStart = (e: React.MouseEvent, direction: 'left' | 'right') => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeDirection(direction);
    startXRef.current = e.clientX;
    startPositionRef.current = task.startX;
    startWidthRef.current = task.width;
    finalStartXRef.current = task.startX;
    finalWidthRef.current = task.width;
    
    // 獲取父元素 Box 的引用（用於直接操作 DOM）
    if (cardRef.current) {
      parentBoxRef.current = cardRef.current.parentElement;
    }
  };

  useEffect(() => {
    if (!isResizing || !parentBoxRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!parentBoxRef.current || !task.memberId) return;

      const deltaX = e.clientX - startXRef.current;

      if (resizeDirection === 'right') {
        // 直接操作 DOM 更新寬度
        const newWidth = Math.max(50, startWidthRef.current + deltaX);
        parentBoxRef.current.style.width = `${newWidth}px`;
        finalWidthRef.current = newWidth;
      } else if (resizeDirection === 'left') {
        // 直接操作 DOM 更新位置和寬度
        const newStartX = Math.max(0, startPositionRef.current + deltaX);
        const deltaPosition = newStartX - startPositionRef.current;
        const newWidth = Math.max(50, startWidthRef.current - deltaPosition);
        
        parentBoxRef.current.style.left = `${Math.max(8, newStartX)}px`;
        parentBoxRef.current.style.width = `${newWidth}px`;
        finalStartXRef.current = newStartX;
        finalWidthRef.current = newWidth;
      }
    };

    const handleMouseUp = () => {
      // 清除我們設置的 inline styles，讓 React 接管
      if (parentBoxRef.current) {
        parentBoxRef.current.style.width = '';
        parentBoxRef.current.style.left = '';
      }
      
      // 只在 mouseup 時調用一次 updateTask，這樣會被記錄到歷史
      if (resizeDirection === 'right') {
        updateTask(task.id, { width: finalWidthRef.current });
      } else if (resizeDirection === 'left') {
        updateTask(task.id, { 
          startX: finalStartXRef.current, 
          width: finalWidthRef.current 
        });
      }
      
      setIsResizing(false);
      setResizeDirection(null);
      parentBoxRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeDirection, task.id, task.memberId, updateTask]);

  // 不使用 dnd-kit 的 transform，因为我们使用 DragOverlay
  const style = undefined;

  return (
    <Card
      ref={(node) => {
        setNodeRef(node);
        (cardRef as any).current = node;
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={style}
      elevation={isHovered ? 4 : 2}
      sx={{
        cursor: actualIsDragging ? 'grabbing' : 'grab',
        height: 42,
        width: '100%',
        transition: (isResizing || actualIsDragging) ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: isResizing || actualIsDragging ? 'none' : 'scale(1.02) translateY(-2px)',
          boxShadow: 4,
        },
        visibility: actualIsDragging ? 'hidden' : 'visible',
        position: 'relative',
        backgroundColor: task.backgroundColor || 'background.paper',
      }}
      {...attributes}
      {...listeners}
    >
      <CardContent sx={{ 
        p: 1.5, 
        '&:last-child': { pb: 1.5 }, 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        {/* 超連結標記 */}
        {task.url && (
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 16,
              height: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(33, 150, 243, 0.15)',
              borderRadius: '50%',
              zIndex: 0,
            }}
          >
            <LinkIcon sx={{ fontSize: 10, color: '#2196F3' }} />
          </Box>
        )}

        <EditableText
          value={task.title}
          onChange={handleTitleChange}
          variant="body2"
          placeholder="任務名稱"
          onEditingChange={setIsEditingTitle}
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 400,
            letterSpacing: '0.02em',
            lineHeight: 1.2,
          }}
        />

        {/* Hover 時顯示的操作按鈕（編輯標題時隱藏） */}
        {isHovered && !actualIsDragging && !isEditingTitle && (
          <>
            {!isNarrow ? (
              // 寬卡片：顯示所有按鈕
              <>
                <Tooltip title="選擇顏色">
                  <IconButton
                    size="small"
                    onClick={handleColorPickerOpen}
                    onMouseDown={(e) => e.stopPropagation()}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      left: 14,
                      width: 24,
                      height: 24,
                      padding: 0.5,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: 'text.secondary',
                      transition: 'background-color 0.2s, color 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        color: 'primary.main',
                        transform: 'translateY(-50%)',
                      },
                    }}
                  >
                    <PaletteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="複製工作卡">
                  <IconButton
                    size="small"
                    onClick={handleDuplicate}
                    onMouseDown={(e) => e.stopPropagation()}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      left: 40,
                      width: 24,
                      height: 24,
                      padding: 0.5,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: 'text.secondary',
                      transition: 'background-color 0.2s, color 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        color: '#4CAF50',
                        transform: 'translateY(-50%)',
                      },
                    }}
                  >
                    <ContentCopyIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title={task.url ? "Cmd+點擊開啟連結 / 點擊編輯" : "設定超連結"}>
                  <IconButton
                    size="small"
                    onClick={handleLinkClick}
                    onMouseDown={(e) => e.stopPropagation()}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      right: 40,
                      width: 24,
                      height: 24,
                      padding: 0.5,
                      backgroundColor: task.url ? 'rgba(33, 150, 243, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                      color: task.url ? '#2196F3' : 'text.secondary',
                      transition: 'background-color 0.2s, color 0.2s',
                      '&:hover': {
                        backgroundColor: task.url ? 'rgba(33, 150, 243, 0.2)' : 'rgba(255, 255, 255, 1)',
                        color: '#2196F3',
                        transform: 'translateY(-50%)',
                      },
                    }}
                  >
                    {task.url ? <OpenInNewIcon sx={{ fontSize: 16 }} /> : <LinkIcon sx={{ fontSize: 16 }} />}
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              // 窄卡片：顯示「更多」按鈕
              <Tooltip title="更多操作">
                <IconButton
                  size="small"
                  onClick={handleMoreMenuOpen}
                  onMouseDown={(e) => e.stopPropagation()}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    left: 14,
                    width: 24,
                    height: 24,
                    padding: 0.5,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: 'text.secondary',
                    transition: 'background-color 0.2s, color 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      color: 'primary.main',
                      transform: 'translateY(-50%)',
                    },
                  }}
                >
                  <MoreVertIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}

            {/* 刪除按鈕：永遠顯示 */}
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                right: 14,
                width: 24,
                height: 24,
                padding: 0.5,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'text.secondary',
                transition: 'background-color 0.2s, color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  color: '#E57373',
                  transform: 'translateY(-50%)',
                },
              }}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </>
        )}

        {/* 左側伸縮手柄（編輯標題時隱藏） */}
        {isHovered && !actualIsDragging && !isEditingTitle && task.memberId && (
          <Box
            onMouseDown={(e) => handleResizeStart(e, 'left')}
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 8,
              cursor: 'ew-resize',
              backgroundColor: 'primary.main',
              opacity: 0.5,
              '&:hover': {
                opacity: 1,
              },
            }}
          />
        )}

        {/* 右側伸縮手柄（編輯標題時隱藏） */}
        {isHovered && !actualIsDragging && !isEditingTitle && task.memberId && (
          <Box
            onMouseDown={(e) => handleResizeStart(e, 'right')}
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 8,
              cursor: 'ew-resize',
              backgroundColor: 'primary.main',
              opacity: 0.5,
              '&:hover': {
                opacity: 1,
              },
            }}
          />
        )}
      </CardContent>

      {/* 調色盤彈出視窗 */}
      <Popover
        open={Boolean(colorPickerAnchor)}
        anchorEl={colorPickerAnchor}
        onClose={handleColorPickerClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Box sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 1.5,
              mb: 2,
            }}
          >
            {TASK_COLORS.map((color) => (
              <Box
                key={color}
                onClick={(e) => {
                  e.stopPropagation();
                  handleColorSelect(color);
                }}
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: color,
                  border: task.backgroundColor === color ? '3px solid transparent' : '1px solid #e0e0e0',
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundImage: task.backgroundColor === color 
                    ? `linear-gradient(${color}, ${color}), linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)`
                    : 'none',
                  backgroundOrigin: 'border-box',
                  backgroundClip: task.backgroundColor === color ? 'padding-box, border-box' : 'padding-box',
                  boxShadow: task.backgroundColor === color 
                    ? '0 0 12px rgba(102, 126, 234, 0.4), 0 0 24px rgba(118, 75, 162, 0.2)' 
                    : 'none',
                  '&:hover': {
                    transform: 'scale(1.15)',
                    boxShadow: task.backgroundColor === color
                      ? '0 0 16px rgba(102, 126, 234, 0.5), 0 0 32px rgba(118, 75, 162, 0.3)'
                      : '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
              />
            ))}
          </Box>
          {task.backgroundColor && (
            <Box
              onClick={(e) => {
                e.stopPropagation();
                handleColorClear();
              }}
              sx={{
                textAlign: 'center',
                cursor: 'pointer',
                color: 'text.secondary',
                fontSize: '0.875rem',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                },
              }}
            >
              清除顏色
            </Box>
          )}
        </Box>
      </Popover>

      {/* 更多操作選單（窄卡片使用） */}
      <Menu
        anchorEl={moreMenuAnchor}
        open={Boolean(moreMenuAnchor)}
        onClose={handleMoreMenuClose}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleMoreMenuColorPicker}>
          <ListItemIcon>
            <PaletteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>選擇顏色</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMoreMenuDuplicate}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>複製工作卡</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMoreMenuLink}>
          <ListItemIcon>
            {task.url ? <OpenInNewIcon fontSize="small" /> : <LinkIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>{task.url ? '編輯連結' : '設定超連結'}</ListItemText>
        </MenuItem>
      </Menu>

      {/* 超連結編輯對話框 */}
      <Dialog
        open={urlDialogOpen}
        onClose={() => setUrlDialogOpen(false)}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <DialogTitle>設定超連結</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="網址"
            type="url"
            fullWidth
            variant="outlined"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleUrlSave();
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          {task.url && (
            <Button onClick={handleUrlClear} color="error">
              清除連結
            </Button>
          )}
          <Button onClick={() => setUrlDialogOpen(false)}>
            取消
          </Button>
          <Button onClick={handleUrlSave} variant="contained">
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
