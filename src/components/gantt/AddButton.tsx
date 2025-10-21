import { Box, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface AddButtonProps {
  onClick: () => void;
  position?: 'right' | 'bottom' | 'center';
  label?: string;
  className?: string;
}

export default function AddButton({
  onClick,
  position = 'center',
  label = '新增',
  className,
}: AddButtonProps) {
  const positionStyles = {
    right: {
      position: 'absolute',
      right: -16,
      top: '50%',
      transform: 'translateY(-50%)',
      opacity: 0,
      transition: 'opacity 0.2s',
    },
    bottom: {
      position: 'absolute',
      bottom: -16,
      left: '50%',
      transform: 'translateX(-50%)',
      opacity: 0,
      transition: 'opacity 0.2s',
    },
    center: {
      position: 'static',
    },
  };

  return (
    <Tooltip title={label} arrow>
      <Box
        className={className}
        sx={{
          ...positionStyles[position],
          zIndex: 10,
        }}
      >
        <IconButton
          onClick={onClick}
          size="small"
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: 'primary.dark',
              transform: 'scale(1.1)',
              boxShadow: 4,
            },
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Tooltip>
  );
}

