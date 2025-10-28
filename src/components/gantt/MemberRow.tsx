import { Box, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable, useDndContext } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Member } from '@/types/gantt.types';
import { useGanttStore } from '@/store/ganttStore';
import EditableText from '../common/EditableText';
import TaskCard from './TaskCard';
import { useTranslation } from 'react-i18next';

interface MemberRowProps {
  member: Member;
  memberIndex: number;
  onAddMember: (afterOrder?: number) => void;
}

export default function MemberRow({ member, memberIndex, onAddMember }: MemberRowProps) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [isNameHovered, setIsNameHovered] = useState(false);
  const [isTopLineHovered, setIsTopLineHovered] = useState(false);
  const [isBottomLineHovered, setIsBottomLineHovered] = useState(false);
  const sprints = useGanttStore((state) => state.sprints);
  const updateMember = useGanttStore((state) => state.updateMember);
  const deleteMember = useGanttStore((state) => state.deleteMember);
  const tasks = useGanttStore((state) => state.tasks);

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `member-${member.id}` });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `member-row-${member.id}`,
  });
  
  // 使用 DndContext 來檢測當前拖曳是否在這個 member 上
  const { over } = useDndContext();
  const isOverThisMember = over && (
    over.id === `member-row-${member.id}` || 
    over.id === `member-${member.id}`
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleNameChange = (newName: string) => {
    updateMember(member.id, { name: newName });
  };

  const handleDelete = () => {
    deleteMember(member.id);
  };

  const sortedSprints = [...sprints].sort((a, b) => a.order - b.order);
  const SPRINT_WIDTH = 187.5; // 每個 Sprint 的固定寬度
  const totalWidth = sortedSprints.length * SPRINT_WIDTH;

  // 計算此 member 需要的最大行數
  const memberTasks = tasks.filter((t) => t.memberId === member.id);
  const maxRowIndex = memberTasks.length > 0 
    ? Math.max(...memberTasks.map((t) => t.rowIndex)) + 1 
    : 1;
  const rowHeight = Math.max(66, 12 + maxRowIndex * 54); // 上padding 12px + 行數 * (卡片高度42px + 間距12px)

  return (
    <Box
      ref={(node) => {
        setSortableRef(node);
      }}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: 'flex',
        minHeight: rowHeight,
        position: 'relative',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.02)' : 'background.paper',
        overflow: 'visible',
        zIndex: isNameHovered ? 100 : 1,
        '&:hover': {
          boxShadow: isHovered && !isDragging ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
        },
      }}
    >
      {/* Member 名稱欄 */}
      <Box
        onMouseEnter={() => setIsNameHovered(true)}
        onMouseLeave={() => setIsNameHovered(false)}
        sx={{
          width: 150,
          flexShrink: 0,
          borderRight: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.paper',
          position: 'sticky',
          left: 0,
          zIndex: isNameHovered ? 100 : 5,
          overflow: 'visible',
          p: 2,
        }}
      >
        {/* 中間名稱區域 */}
        <Box sx={{ textAlign: 'center' }}>
          <EditableText
            value={member.name}
            onChange={handleNameChange}
            variant="body2"
            placeholder={t('gantt.member.namePlaceholder')}
            sx={{ fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif', fontWeight: 500, fontSize: '1.05rem' }}
          />
        </Box>

        {/* 左側拖曳按鈕 - 浮動 */}
        {isNameHovered && (
          <Tooltip title={t('gantt.member.drag')}>
            <IconButton
              size="small"
              {...attributes}
              {...listeners}
              sx={{
                position: 'absolute',
                left: 4,
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'grab',
                width: 24,
                height: 24,
                color: 'text.secondary',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transition: 'background-color 0.2s, color 0.2s',
                '&:active': {
                  cursor: 'grabbing',
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  color: 'primary.main',
                  transform: 'translateY(-50%)',
                },
              }}
            >
              <DragIndicatorIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}

        {/* 右側刪除按鈕 - 浮動 */}
        {isNameHovered && (
          <Tooltip title={t('gantt.member.delete')}>
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                position: 'absolute',
                right: 4,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 24,
                height: 24,
                color: 'text.secondary',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transition: 'background-color 0.2s, color 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  color: '#E57373',
                  transform: 'translateY(-50%)',
                },
              }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        )}

        {/* 上方觸發區域和添加按鈕 */}
        {memberIndex === 0 && (
          <Box
            onMouseEnter={() => setIsTopLineHovered(true)}
            onMouseLeave={() => setIsTopLineHovered(false)}
            sx={{
              position: 'absolute',
              top: -8,
              left: 0,
              right: 0,
              height: 16,
              cursor: 'pointer',
              zIndex: 150,
            }}
          >
            {isTopLineHovered && (
              <Tooltip title={t('gantt.member.insertAbove')}>
                <IconButton
                  size="small"
                  onClick={() => onAddMember(member.order - 1)}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'primary.main',
                    color: 'white',
                    width: 24,
                    height: 24,
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
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}

        {/* 底部觸發區域和添加按鈕 */}
        <Box
          onMouseEnter={() => setIsBottomLineHovered(true)}
          onMouseLeave={() => setIsBottomLineHovered(false)}
          sx={{
            position: 'absolute',
            bottom: -8,
            left: 0,
            right: 0,
            height: 16,
            cursor: 'pointer',
            zIndex: 150,
          }}
        >
          {isBottomLineHovered && (
            <Tooltip title={t('gantt.member.insertBelow')}>
              <IconButton
                size="small"
                onClick={() => onAddMember(member.order)}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'primary.main',
                  color: 'white',
                  width: 24,
                  height: 24,
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
                <AddIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* 甘特圖區域 - 可自由拖放 */}
      <Box
        ref={setDroppableRef}
        data-member-id={member.id}
        sx={{
          display: 'flex',
          position: 'relative',
          backgroundColor: isOverThisMember ? 'rgba(103, 80, 164, 0.05)' : 'background.paper',
          transition: 'background-color 0.2s',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {/* Sprint 區域容器 */}
        <Box
          sx={{
            width: totalWidth,
            flexShrink: 0,
            position: 'relative',
          }}
        >
          {/* 渲染 Sprint 背景格子 */}
          {sortedSprints.map((sprint, index) => (
            <Box
              key={sprint.id}
              sx={{
                position: 'absolute',
                left: index * SPRINT_WIDTH,
                top: 0,
                bottom: 0,
                width: SPRINT_WIDTH,
                backgroundColor: `${sprint.color}30`,
                borderRight: '1px solid',
                borderColor: 'divider',
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* 渲染任務卡片 - 使用絕對定位 */}
          {memberTasks.map((task) => (
            <Box
              key={task.id}
              sx={{
                position: 'absolute',
                left: Math.max(8, task.startX), // 最小左邊距 8px
                top: task.rowIndex * 54 + 12, // 每行間距 54px (卡片42px + 間距12px)，上 padding 12px
                width: task.width,
                zIndex: 1,
                transition: 'none !important', // 强制禁用所有动画
              }}
            >
              <TaskCard task={task} />
            </Box>
          ))}
        </Box>
        
        {/* 右側空白區域 - 方便操作 add sprint */}
        {sortedSprints.length > 0 && (
          <Box
            sx={{
              width: SPRINT_WIDTH,
              flexShrink: 0,
            }}
          />
        )}
      </Box>
    </Box>
  );
}
