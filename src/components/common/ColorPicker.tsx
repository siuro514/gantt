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
        <Box
          sx={{
            p: 2,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            width: 180,
          }}
        >
          {MORANDI_COLORS.map((color) => (
            <Box
              key={color}
              onClick={() => handleColorSelect(color)}
              sx={{
                width: 48,
                height: 48,
                backgroundColor: color,
                borderRadius: 2,
                cursor: 'pointer',
                border: color === currentColor ? '3px solid #6750A4' : '2px solid #E0E0E0',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                '&:hover': {
                  transform: 'scale(1.15) rotate(5deg)',
                  boxShadow: 3,
                  zIndex: 1,
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
              }}
            />
          ))}
        </Box>
      </Popover>
    </>
  );
}

