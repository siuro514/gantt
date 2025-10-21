import { useState, useRef, useEffect } from 'react';
import { TextField, Box, SxProps, Theme } from '@mui/material';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  variant?: 'h6' | 'subtitle1' | 'body1' | 'body2';
  placeholder?: string;
  multiline?: boolean;
  sx?: SxProps<Theme>;
}

export default function EditableText({
  value,
  onChange,
  variant = 'body1',
  placeholder = 'Click to edit',
  multiline = false,
  sx = {},
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue.trim() && tempValue !== value) {
      onChange(tempValue.trim());
    } else {
      setTempValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <TextField
        inputRef={inputRef}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        variant="standard"
        size="small"
        multiline={multiline}
        fullWidth
        sx={{
          '& .MuiInputBase-root': {
            fontSize: variant === 'h6' ? '1.25rem' : variant === 'subtitle1' ? '1rem' : variant === 'body1' ? '1rem' : '0.875rem',
            fontWeight: variant === 'h6' ? 500 : variant === 'subtitle1' ? 500 : 400,
          },
          '& .MuiInputBase-input': {
            textAlign: 'center',
          },
          ...sx,
        }}
      />
    );
  }

  return (
    <Box
      onClick={handleClick}
      sx={{
        cursor: 'text',
        padding: '4px 8px',
        fontSize: variant === 'h6' ? '1.25rem' : variant === 'subtitle1' ? '1rem' : variant === 'body1' ? '1rem' : '0.875rem',
        fontWeight: variant === 'h6' ? 500 : variant === 'subtitle1' ? 500 : 400,
        minHeight: '24px',
        borderRadius: 1,
        transition: 'all 0.15s ease-in-out',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          transform: 'translateX(2px)',
        },
        ...sx,
      }}
    >
      {value || placeholder}
    </Box>
  );
}

