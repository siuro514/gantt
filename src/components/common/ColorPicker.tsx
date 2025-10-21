import { Box, Popover, IconButton } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import { useState } from 'react';
import { MORANDI_COLORS } from '@/utils/colors';

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorPicker({ currentColor, onColorChange }: ColorPickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorSelect = (color: string) => {
    onColorChange(color);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          width: 24,
          height: 24,
          padding: 0.5,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
        }}
      >
        <PaletteIcon sx={{ fontSize: 16 }} />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Box sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1.5,
            }}
          >
            {MORANDI_COLORS.map((color) => (
              <Box
                key={color}
                onClick={() => handleColorSelect(color)}
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: color,
                  border: color === currentColor ? '3px solid transparent' : '1px solid #e0e0e0',
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundImage: color === currentColor 
                    ? `linear-gradient(${color}, ${color}), linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)`
                    : 'none',
                  backgroundOrigin: 'border-box',
                  backgroundClip: color === currentColor ? 'padding-box, border-box' : 'padding-box',
                  boxShadow: color === currentColor 
                    ? '0 0 12px rgba(102, 126, 234, 0.4), 0 0 24px rgba(118, 75, 162, 0.2)' 
                    : 'none',
                  '&:hover': {
                    transform: 'scale(1.15)',
                    boxShadow: color === currentColor
                      ? '0 0 16px rgba(102, 126, 234, 0.5), 0 0 32px rgba(118, 75, 162, 0.3)'
                      : '0 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Popover>
    </>
  );
}

