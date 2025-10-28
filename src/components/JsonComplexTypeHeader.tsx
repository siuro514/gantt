import { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';

interface JsonComplexTypeHeaderProps {
  type: 'array' | 'object';
  length: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAdd: () => void;
  onTypeChange: (type: string) => void;
  onDelete?: () => void;
  isRootLevel?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  array: '#00bcd4',
  object: '#9c27b0',
};

const TYPE_LABELS: Record<string, string> = {
  array: 'Array',
  object: 'Object',
};

export default function JsonComplexTypeHeader({
  type,
  length,
  isExpanded,
  onToggleExpand,
  onAdd,
  onTypeChange,
  onDelete,
  isRootLevel = false,
}: JsonComplexTypeHeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleTypeClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleTypeSelect = (newType: string) => {
    onTypeChange(newType);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <IconButton size="small" onClick={onToggleExpand}>
        {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
      </IconButton>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.5,
            backgroundColor: 'grey.100',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography sx={{ fontFamily: 'monospace', color: 'text.secondary', fontSize: '0.875rem' }}>
            {type === 'array' ? `[${length}]` : `{${length}}`}
          </Typography>
          
          <Chip
            label={TYPE_LABELS[type]}
            size="small"
            onClick={handleTypeClick}
            sx={{
              height: 20,
              fontSize: '0.7rem',
              fontWeight: 600,
              backgroundColor: 'grey.200',
              color: TYPE_COLORS[type],
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'grey.300',
              },
            }}
          />
        </Box>

        {onDelete && (
          <Tooltip title="刪除">
            <IconButton
              size="small"
              onClick={onDelete}
              sx={{
                color: '#ef5350',
                opacity: 0.5,
                padding: '2px',
                '&:hover': {
                  opacity: 1,
                  backgroundColor: 'rgba(239, 83, 80, 0.08)',
                },
              }}
            >
              <CloseIcon sx={{ fontSize: '16px' }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Tooltip title={type === 'array' ? '添加項目' : '添加屬性'}>
        <IconButton 
          size="small" 
          onClick={onAdd}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            width: 24,
            height: 24,
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          <AddIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>

      {/* Type Selection Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {!isRootLevel && (
          <>
            <MenuItem onClick={() => handleTypeSelect('string')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4caf50' }} />
                String
              </Box>
            </MenuItem>
            <MenuItem onClick={() => handleTypeSelect('number')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#2196f3' }} />
                Number
              </Box>
            </MenuItem>
            <MenuItem onClick={() => handleTypeSelect('boolean')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ff9800' }} />
                Boolean
              </Box>
            </MenuItem>
            <MenuItem onClick={() => handleTypeSelect('null')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f44336' }} />
                Null
              </Box>
            </MenuItem>
          </>
        )}
        <MenuItem onClick={() => handleTypeSelect('object')}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#9c27b0' }} />
            Object
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handleTypeSelect('array')}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00bcd4' }} />
            Array
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
}

