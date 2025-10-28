import { useState } from 'react';
import { Box, IconButton, Popover, Tooltip, Typography } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import { useGanttStore } from '@/store/ganttStore';

// 莫蘭迪色系主題色 - 6x7 布局，同色系放同一行
const THEME_COLORS = [
  // 淺色系
  // 第一行：紫/粉/紅系
  '#C8B6D8', '#D4BBD1', '#D9B5B0', '#E8C4B8', '#F0D4C3', '#E8C5C0', '#DDB5B5',
  // 第二行：藍/綠/青系
  '#A8C5D6', '#B3D4D1', '#B8D4C8', '#C5D9C0', '#D1E0C5', '#C8D8C0', '#BDD4C8',
  // 第三行：黃/米/灰系
  '#E8D9B5', '#E0D4B8', '#D9D1B8', '#D4C9B0', '#C9C0B0', '#C0B8A8', '#B5ADA0',
  
  // 暗色系
  // 第四行：深紫/深粉/深紅系
  '#8B7A9D', '#9A8595', '#A07570', '#B08070', '#A67C6D', '#957070', '#8B6B6B',
  // 第五行：深藍/深綠/深青系
  '#6A8595', '#708D8A', '#758A80', '#7A9070', '#809570', '#758570', '#6D7D75',
  // 第六行：深黃/深米/深灰系
  '#9D8B60', '#958870', '#8D8070', '#857865', '#7D7060', '#75685D', '#6D6058',
];

export default function ThemeColorPicker() {
  const { primaryColor, updatePrimaryColor } = useGanttStore();
  const [colorPickerAnchor, setColorPickerAnchor] = useState<HTMLElement | null>(null);

  return (
    <>
      <Tooltip title="更改網站主題顏色">
        <IconButton
          onClick={(e) => setColorPickerAnchor(e.currentTarget)}
          sx={{
            width: 56,
            height: 56,
            backgroundColor: primaryColor,
            color: 'white',
            '&:hover': {
              backgroundColor: primaryColor,
              opacity: 0.9,
            },
          }}
        >
          <PaletteIcon />
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(colorPickerAnchor)}
        anchorEl={colorPickerAnchor}
        onClose={() => setColorPickerAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
            選擇主題顏色
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
            這會改變整個網站的主色調
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 1.5,
            }}
          >
            {THEME_COLORS.map((color) => (
              <Box
                key={color}
                onClick={() => {
                  updatePrimaryColor(color);
                  setColorPickerAnchor(null);
                }}
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: color,
                  border: primaryColor === color ? '3px solid transparent' : '1px solid #e0e0e0',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundImage: primaryColor === color 
                    ? `linear-gradient(${color}, ${color}), linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)`
                    : 'none',
                  backgroundOrigin: 'border-box',
                  backgroundClip: primaryColor === color ? 'padding-box, border-box' : 'padding-box',
                  boxShadow: primaryColor === color 
                    ? '0 0 12px rgba(102, 126, 234, 0.4), 0 0 24px rgba(118, 75, 162, 0.2)' 
                    : 'none',
                  '&:hover': {
                    transform: 'scale(1.15)',
                    boxShadow: primaryColor === color
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

