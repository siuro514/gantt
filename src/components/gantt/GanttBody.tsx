import { Box } from '@mui/material';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useGanttStore } from '@/store/ganttStore';
import MemberRow from './MemberRow';
import AddButton from './AddButton';

export default function GanttBody() {
  const members = useGanttStore((state) => state.members);
  const addMember = useGanttStore((state) => state.addMember);

  const sortedMembers = [...members].sort((a, b) => a.order - b.order);

  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: 'background.paper',
        overflow: 'visible',
      }}
    >
      <SortableContext
        items={sortedMembers.map((m) => `member-${m.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {sortedMembers.map((member, index) => (
          <MemberRow
            key={member.id}
            member={member}
            memberIndex={index}
            onAddMember={addMember}
          />
        ))}
      </SortableContext>

      {/* 如果沒有 member，顯示新增按鈕 */}
      {sortedMembers.length === 0 && (
        <Box
          sx={{
            display: 'flex',
          }}
        >
          {/* Member 欄位 */}
          <Box
            sx={{
              width: 150,
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: 2,
              borderColor: 'divider',
            }}
          >
            <AddButton onClick={() => addMember()} label="新增第一個 Member" />
          </Box>
          
          {/* Sprint 欄位 - 空狀態提示 */}
          <Box
            sx={{
              flex: 1,
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            請先新增 Member 和 Sprint
          </Box>
        </Box>
      )}
    </Box>
  );
}
