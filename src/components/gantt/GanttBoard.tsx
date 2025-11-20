import { Box, Paper } from '@mui/material';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragMoveEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core';
import { useState, useRef } from 'react';
import Toolbar from './Toolbar';
import GanttHeader from './GanttHeader';
import GanttBody from './GanttBody';
import StorageArea from './StorageArea';
import TaskCard from './TaskCard';
import { useGanttStore } from '@/store/ganttStore';

interface GanttBoardProps {
  navbarOffset?: number;
}

export default function GanttBoard({ navbarOffset = 0 }: GanttBoardProps) {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'task' | 'member' | null>(null);
  const lastValidOverRef = useRef<{ id: string } | null>(null);
  const tasks = useGanttStore((state) => state.tasks);
  const members = useGanttStore((state) => state.members);
  const moveTask = useGanttStore((state) => state.moveTask);
  const reorderMembers = useGanttStore((state) => state.reorderMembers);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    
    if (id.startsWith('member-')) {
      setActiveType('member');
      setActiveTaskId(null);
    } else {
      setActiveType('task');
      setActiveTaskId(id);
    }
    
    // 重置最后一个有效的 over
    lastValidOverRef.current = null;
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { over } = event;
    
    // 如果当前有有效的 over，记录下来
    if (over) {
      lastValidOverRef.current = over;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    console.log('=== Drag End ===', { activeId: active.id, overId: over?.id });
    
    // 立即清除 activeTaskId 以隐藏 DragOverlay
    const currentActiveType = activeType;
    const currentActiveTaskId = activeTaskId;
    setActiveTaskId(null);
    setActiveType(null);
    
    // 使用最后一个有效的 over，如果当前 over 为 null
    const effectiveOver = over || lastValidOverRef.current;
    
    if (!effectiveOver) {
      console.log('No effective over, returning');
      return;
    }

    const activeId = active.id as string;
    const overId = effectiveOver.id as string;
    
    console.log('Active type:', currentActiveType, 'Over ID:', overId);

    // 處理 Member 排序
    if (currentActiveType === 'member' && activeId.startsWith('member-') && overId.startsWith('member-')) {
      const sortedMembers = [...members].sort((a, b) => a.order - b.order);
      const oldIndex = sortedMembers.findIndex((m) => `member-${m.id}` === activeId);
      const newIndex = sortedMembers.findIndex((m) => `member-${m.id}` === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        reorderMembers(oldIndex, newIndex);
      }
    }
    
    // 處理 Task 移動
    if (currentActiveType === 'task') {
      console.log('Handling task move');
      const task = tasks.find((t) => t.id === activeId);
      if (!task) {
        console.log('Task not found');
        return;
      }

      if (overId === 'storage') {
        console.log('Moving to storage');
        moveTask(activeId, null, 0, task.width);
      } else if (overId.startsWith('member-row-') || overId.startsWith('member-')) {
        console.log('Moving to member row:', overId);
        // 處理兩種格式：member-row-xxx 或 member-xxx
        const memberId = overId.startsWith('member-row-') 
          ? overId.replace('member-row-', '')
          : overId.replace('member-', '');
        
        // 使用拖曳結束時卡片的實際位置來計算
        const memberRowElement = document.querySelector(`[data-member-id="${memberId}"]`) as HTMLElement;
        let newStartX: number;
        
        if (memberRowElement && active.rect.current.translated) {
          // 卡片拖曳後的左邊界位置（相對於視口）
          const cardLeft = active.rect.current.translated.left;
          
          // 獲取滾動容器
          const scrollContainer = document.getElementById('gantt-scroll-container');
          if (!scrollContainer) {
            newStartX = task.memberId ? task.startX : 50;
          } else {
            // 獲取滾動容器的位置
            const containerRect = scrollContainer.getBoundingClientRect();
            const containerLeft = containerRect.left;
            const scrollLeft = scrollContainer.scrollLeft;
            
            // Member 名稱欄寬度（sticky，固定在左側）
            // 注意：borderRight 已經包含在 MEMBER_COLUMN_WIDTH 的視覺邊界內
            const MEMBER_COLUMN_WIDTH = 150;
            
            // 計算卡片相對於甘特圖內容區域的位置
            const relativeToContainer = cardLeft - containerLeft;
            const relativeToGantt = relativeToContainer - MEMBER_COLUMN_WIDTH;
            const absolutePosition = relativeToGantt + scrollLeft;
            
            console.log('Drop position calculation:', {
              cardLeft,
              containerLeft,
              scrollLeft,
              relativeToContainer,
              relativeToGantt,
              absolutePosition
            });
            
            newStartX = Math.max(8, absolutePosition);
          }
        } else {
          // 回退方案：如果已經在甘特圖中，保持原位置；否則使用預設位置
          newStartX = task.memberId ? task.startX : 50;
        }
        
        moveTask(activeId, memberId, newStartX, task.width);
      }
    }
  };

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <Box
        id="gantt-board"
        sx={{
          width: '100vw',
          height: `calc(100vh - ${64 - navbarOffset}px)`, // 动态高度：随 navbar 隐藏而增加
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default',
          transition: 'height 0s', // 不需要过渡，跟随 wheel 事件
        }}
      >
        <Toolbar />
        
        <Paper
          id="gantt-scroll-container"
          elevation={3}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            mt: 2,
            ml: 2,
            mr: 0,
            mb: '8px',
            borderRadius: '24px 0 0 24px',
            backgroundColor: 'background.paper',
            // 自定义滚动条样式
            '&::-webkit-scrollbar': {
              width: '12px',
              height: '12px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '10px',
              margin: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '10px',
              border: '2px solid transparent',
              backgroundClip: 'padding-box',
              transition: 'background-color 0.3s',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              },
            },
            '&::-webkit-scrollbar-corner': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <GanttHeader />
          <GanttBody />
        </Paper>

        <StorageArea />
      </Box>

      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
        }}
        style={{
          cursor: 'grabbing',
        }}
      >
        {activeTask && activeType === 'task' && (
          <Box sx={{ 
            width: activeTask.width,
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
          }}>
            <TaskCard task={activeTask} />
          </Box>
        )}
      </DragOverlay>
    </DndContext>
  );
}

