import { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Menu,
  Chip,
} from '@mui/material';

interface JsonValueInputProps {
  value: any;
  type: 'string' | 'number' | 'boolean' | 'null';
  onChange: (value: any) => void;
  onTypeChange: (type: string) => void;
  width?: number | string;
  isRootLevel?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  string: '#4caf50',
  number: '#2196f3',
  boolean: '#ff9800',
  null: '#f44336',
};

const TYPE_LABELS: Record<string, string> = {
  string: 'Str',
  number: 'Num',
  boolean: 'Bool',
  null: 'Null',
};

export default function JsonValueInput({
  value,
  type,
  onChange,
  onTypeChange,
  width = 180,
  isRootLevel = false,
}: JsonValueInputProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const renderInput = () => {
    if (type === 'boolean') {
      return (
        <TextField
          select
          size="small"
          value={value ? 'true' : 'false'}
          onChange={(e) => onChange(e.target.value === 'true')}
          sx={{
            width,
            '& .MuiInputBase-root': {
              height: 32,
              paddingRight: '60px',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            },
          }}
        >
          <MenuItem value="true">true</MenuItem>
          <MenuItem value="false">false</MenuItem>
        </TextField>
      );
    }

    if (type === 'null') {
      return (
        <TextField
          size="small"
          value="null"
          disabled
          sx={{
            width,
            '& .MuiInputBase-root': {
              height: 32,
              paddingRight: '60px',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              color: 'error.main',
            },
          }}
        />
      );
    }

    if (type === 'number') {
      return (
        <TextField
          ref={inputRef}
          size="small"
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          sx={{
            width,
            '& .MuiInputBase-root': {
              height: 32,
              paddingRight: '60px',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
            },
          }}
        />
      );
    }

    // string
    return (
      <TextField
        ref={inputRef}
        size="small"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          width,
          '& .MuiInputBase-root': {
            height: 32,
            paddingRight: '60px',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
          },
        }}
      />
    );
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      {renderInput()}
      
      {/* Type Chip Overlay */}
      <Chip
        label={TYPE_LABELS[type]}
        size="small"
        onClick={handleTypeClick}
        sx={{
          position: 'absolute',
          right: 2,
          top: '50%',
          transform: 'translateY(-50%)',
          height: 24,
          fontSize: '0.7rem',
          fontWeight: 600,
          backgroundColor: 'grey.200',
          color: TYPE_COLORS[type],
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'grey.300',
          },
          pointerEvents: 'auto',
          zIndex: 1,
        }}
      />

      {/* Type Selection Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {!isRootLevel && (
          <>
            <MenuItem onClick={() => handleTypeSelect('string')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: TYPE_COLORS.string }} />
                String
              </Box>
            </MenuItem>
            <MenuItem onClick={() => handleTypeSelect('number')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: TYPE_COLORS.number }} />
                Number
              </Box>
            </MenuItem>
            <MenuItem onClick={() => handleTypeSelect('boolean')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: TYPE_COLORS.boolean }} />
                Boolean
              </Box>
            </MenuItem>
            <MenuItem onClick={() => handleTypeSelect('null')}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: TYPE_COLORS.null }} />
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

