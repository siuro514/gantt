import GanttBoard from '@/components/gantt/GanttBoard';
import { Box } from '@mui/material';

export default function GanttPage() {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GanttBoard />
    </Box>
  );
}

