import { Box, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';
import { Sprint } from '@/types/gantt.types';
import { useGanttStore } from '@/store/ganttStore';
import { formatDateShort } from '@/utils/dateUtils';
import EditableText from '../common/EditableText';
import ColorPicker from '../common/ColorPicker';
import { useTranslation } from 'react-i18next';

interface SprintColumnProps {
  sprint: Sprint;
  sprintIndex: number;
  onAddSprint: (afterOrder?: number) => void;
}

export default function SprintColumn({ sprint, sprintIndex, onAddSprint }: SprintColumnProps) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [isLeftLineHovered, setIsLeftLineHovered] = useState(false);
  const [isRightLineHovered, setIsRightLineHovered] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const updateSprint = useGanttStore((state) => state.updateSprint);
  const deleteSprint = useGanttStore((state) => state.deleteSprint);

  const handleTitleChange = (newTitle: string) => {
    updateSprint(sprint.id, { title: newTitle });
  };

  const handleColorChange = (newColor: string) => {
    updateSprint(sprint.id, { color: newColor });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | null) => {
    if (date) {
      updateSprint(sprint.id, {
        [field]: date.toISOString().split('T')[0],
      });
    }
  };

  const handleDelete = () => {
    deleteSprint(sprint.id);
  };

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        width: 187.5,
        flexShrink: 0,
        height: '100%',
        p: 1.5,
        backgroundColor: sprint.color,
        borderRight: 1,
        borderColor: 'divider',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'visible',
        zIndex: isLeftLineHovered || isRightLineHovered ? 100 : 1,
        '&:hover': {
          boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
        },
      }}
    >
      {/* 標題 */}
      <Box sx={{ mb: 0, textAlign: 'center' }}>
        <EditableText
          value={sprint.title}
          onChange={handleTitleChange}
          variant="subtitle1"
          placeholder={t('gantt.sprint.namePlaceholder')}
          sx={{ fontSize: '1.05rem', fontWeight: 500, fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif' }}
        />
      </Box>

      {/* 日期範圍 */}
      <Box
        onClick={() => setIsEditingDate(true)}
        sx={{
          fontSize: '0.8rem',
          color: 'text.secondary',
          cursor: 'pointer',
          textAlign: 'center',
          '&:hover': {
            color: 'primary.main',
          },
        }}
      >
        {formatDateShort(sprint.startDate)} - {formatDateShort(sprint.endDate)}
      </Box>

      {/* 日期編輯彈窗 */}
      {isEditingDate && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 1000,
            backgroundColor: 'white',
            p: 2,
            boxShadow: 3,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
          onMouseLeave={() => setIsEditingDate(false)}
        >
          <DatePicker
            label={t('gantt.sprint.startDate')}
            value={new Date(sprint.startDate)}
            onChange={(date) => handleDateChange('startDate', date)}
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label={t('gantt.sprint.endDate')}
            value={new Date(sprint.endDate)}
            onChange={(date) => handleDateChange('endDate', date)}
            slotProps={{ textField: { size: 'small' } }}
          />
        </Box>
      )}

      {/* Hover 時顯示的按鈕 */}
      {isHovered && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 0.5,
          }}
        >
          <ColorPicker currentColor={sprint.color} onColorChange={handleColorChange} />
          
          <Tooltip title={t('gantt.sprint.delete')}>
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                width: 24,
                height: 24,
                padding: 0.5,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  color: '#E57373',
                },
              }}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* 左側觸發區域和添加按鈕 */}
      {sprintIndex === 0 && (
        <Box
          onMouseEnter={() => setIsLeftLineHovered(true)}
          onMouseLeave={() => setIsLeftLineHovered(false)}
          sx={{
            position: 'absolute',
            left: -8,
            top: 0,
            bottom: 0,
            width: 16,
            cursor: 'pointer',
            zIndex: 150,
          }}
        >
          {isLeftLineHovered && (
            <Tooltip title={t('gantt.sprint.insertLeft')}>
              <IconButton
                size="small"
                onClick={() => onAddSprint(sprint.order - 1)}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'primary.main',
                  color: 'white',
                  width: 20,
                  height: 20,
                  opacity: 0.9,
                  transition: 'all 0.2s',
                  zIndex: 200,
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                    opacity: 1,
                    transform: 'translate(-50%, -50%) scale(1.1)',
                  },
                }}
              >
                <AddIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}

      {/* 右側觸發區域和添加按鈕 */}
      <Box
        onMouseEnter={() => setIsRightLineHovered(true)}
        onMouseLeave={() => setIsRightLineHovered(false)}
        sx={{
          position: 'absolute',
          right: -8,
          top: 0,
          bottom: 0,
          width: 16,
          cursor: 'pointer',
          zIndex: 150,
        }}
      >
        {isRightLineHovered && (
          <Tooltip title={t('gantt.sprint.insertRight')}>
            <IconButton
              size="small"
              onClick={() => onAddSprint(sprint.order)}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'primary.main',
                color: 'white',
                width: 20,
                height: 20,
                opacity: 0.9,
                transition: 'all 0.2s',
                zIndex: 200,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  opacity: 1,
                  transform: 'translate(-50%, -50%) scale(1.1)',
                },
              }}
            >
              <AddIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}

