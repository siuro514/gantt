import { Box, Paper, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDroppable } from '@dnd-kit/core';
import { useGanttStore } from '@/store/ganttStore';
import TaskCard from './TaskCard';
import { useTranslation } from 'react-i18next';

export default function StorageArea() {
  const { t } = useTranslation();
  const tasks = useGanttStore((state) => state.tasks);
  const addTask = useGanttStore((state) => state.addTask);
  const { setNodeRef, isOver } = useDroppable({ id: 'storage' });

  // 過濾出暫存區的任務並排序
  const storageTasks = tasks
    .filter((task) => task.memberId === null)
    .sort((a, b) => (a.storageOrder ?? 0) - (b.storageOrder ?? 0));

  return (
    <>
      <Paper
        elevation={isOver ? 8 : 3}
        sx={{
          mx: 2,
          mt: '8px',
          mb: 2,
          p: 2,
          backgroundColor: isOver ? 'rgba(103, 80, 164, 0.1)' : 'background.paper',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: 3,
          border: isOver ? '2px solid' : 'none',
          borderColor: 'primary.main',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            {t('gantt.storage.title')}
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addTask}
            sx={{ borderRadius: 2 }}
          >
            {t('gantt.storage.addTask')}
          </Button>
        </Box>

        <Box
          ref={setNodeRef}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            minHeight: 80,
            p: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: 2,
          }}
        >
          {storageTasks.map((task) => (
            <Box
              key={task.id}
              sx={{
                width: 171.5,
              }}
            >
              <TaskCard task={task} />
            </Box>
          ))}

          {storageTasks.length === 0 && (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
                py: 2,
              }}
            >
              <Typography variant="body2">
                {t('gantt.storage.emptyHint')}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </>
  );
}

