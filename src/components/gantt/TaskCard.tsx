import { Box, Card, CardContent, IconButton, Tooltip, Popover } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PaletteIcon from '@mui/icons-material/Palette';
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
  const cardRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startPositionRef = useRef(0);
  const startWidthRef = useRef(0);

  const updateTask = useGanttStore((state) => state.updateTask);
  const deleteTask = useGanttStore((state) => state.deleteTask);

  const { attributes, listeners, setNodeRef, transform, isDragging: isDraggingDnd } = useDraggable({
    id: task.id,
    disabled: isResizing,
  });

  const actualIsDragging = isDragging || isDraggingDnd;

  const handleTitleChange = (newTitle: string) => {
    updateTask(task.id, { title: newTitle });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
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

  const handleResizeStart = (e: React.MouseEvent, direction: 'left' | 'right') => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeDirection(direction);
    startXRef.current = e.clientX;
    startPositionRef.current = task.startX;
    startWidthRef.current = task.width;
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || !task.memberId) return;

      const deltaX = e.clientX - startXRef.current;

      if (resizeDirection === 'right') {
        // 調整寬度
        const newWidth = Math.max(50, startWidthRef.current + deltaX);
        updateTask(task.id, { width: newWidth });
      } else if (resizeDirection === 'left') {
        // 調整位置和寬度
        const newStartX = Math.max(0, startPositionRef.current + deltaX);
        const deltaPosition = newStartX - startPositionRef.current;
        const newWidth = Math.max(50, startWidthRef.current - deltaPosition);
        
        updateTask(task.id, { 
          startX: newStartX, 
          width: newWidth 
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeDirection, task.id, task.memberId, task.startX, task.width, updateTask]);

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
        <EditableText
          value={task.title}
          onChange={handleTitleChange}
          variant="body2"
          placeholder="任務名稱"
        />

        {/* Hover 時顯示的調色盤和刪除按鈕 */}
        {isHovered && !actualIsDragging && (
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
                  right: 40,
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

        {/* 左側伸縮手柄 */}
        {isHovered && !actualIsDragging && task.memberId && (
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

        {/* 右側伸縮手柄 */}
        {isHovered && !actualIsDragging && task.memberId && (
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
        <Box sx={{ p: 2, maxWidth: 320 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 1,
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
                  width: 32,
                  height: 32,
                  backgroundColor: color,
                  border: task.backgroundColor === color ? '3px solid #000' : '1px solid #ddd',
                  borderRadius: 1,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'scale(1.15)',
                    boxShadow: 2,
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
    </Card>
  );
}
