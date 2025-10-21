import { Box, useTheme } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useGanttStore } from '@/store/ganttStore';
import SprintColumn from './SprintColumn';
import AddButton from './AddButton';

export default function GanttHeader() {
  const theme = useTheme();
  const sprints = useGanttStore((state) => state.sprints);
  const addSprint = useGanttStore((state) => state.addSprint);

  const sortedSprints = [...sprints].sort((a, b) => a.order - b.order);
  const SPRINT_WIDTH = 187.5;

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: 80,
        position: 'sticky',
        top: 0,
        backgroundColor: 'background.paper',
        zIndex: 20,
      }}
    >
      {/* Member 欄位標題 - 對角線分隔 */}
      <Box
        sx={{
          width: 150,
          flexShrink: 0,
          borderRight: 2,
          borderBottom: 2,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          position: 'sticky',
          left: 0,
          zIndex: 21,
        }}
      >
        {/* SVG 對角線 - 從左上到右下 */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <line
            x1="0"
            y1="0"
            x2="150"
            y2="80"
            stroke={theme.palette.divider}
            strokeWidth="1.5"
          />
        </svg>
        
        {/* 左下角 - 成員圖標 (在三角形重心位置) */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 14,
            left: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PeopleIcon sx={{ fontSize: 26, color: 'text.secondary' }} />
        </Box>
        
        {/* 右上角 - 時程圖標 (在三角形重心位置) */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CalendarTodayIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        </Box>
      </Box>

      {/* Sprint 欄位 */}
      <Box
        sx={{
          display: 'flex',
          overflow: 'visible',
          borderBottom: 2,
          borderColor: 'divider',
        }}
      >
        {sortedSprints.map((sprint, index) => (
          <SprintColumn 
            key={sprint.id} 
            sprint={sprint}
            sprintIndex={index}
            onAddSprint={addSprint}
          />
        ))}

        {/* 如果沒有 sprint，顯示新增按鈕 */}
        {sortedSprints.length === 0 && (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 300,
              borderRight: 1,
              borderColor: 'divider',
            }}
          >
            <AddButton onClick={() => addSprint()} label="新增第一個 Sprint" />
          </Box>
        )}
        
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
