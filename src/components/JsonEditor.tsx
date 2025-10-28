import { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import JsonValueInput from './JsonValueInput';
import JsonComplexTypeHeader from './JsonComplexTypeHeader';

interface JsonEditorProps {
  data: any;
  onChange: (newData: any) => void;
  path?: string[];
}

export default function JsonEditor({ data, onChange, path = [] }: JsonEditorProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editingKeys, setEditingKeys] = useState<Record<string, string>>({});

  const toggleExpand = (key: string) => {
    setExpanded((prev) => {
      // 如果 key 不存在，默认是展开的（true），所以要设为 false
      const currentState = prev[key] !== false;
      return { ...prev, [key]: !currentState };
    });
  };

  const updateValue = (keys: string[], value: any) => {
    // 如果是根级别（空路径），直接更新整个数据
    if (keys.length === 0) {
      onChange(value);
      return;
    }
    
    const newData = JSON.parse(JSON.stringify(data));
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    onChange(newData);
  };

  const deleteValue = (keys: string[]) => {
    const newData = JSON.parse(JSON.stringify(data));
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    const lastKey = keys[keys.length - 1];
    if (Array.isArray(current)) {
      current.splice(parseInt(lastKey), 1);
    } else {
      delete current[lastKey];
    }
    
    onChange(newData);
  };

  const addArrayItem = (keys: string[]) => {
    const newData = JSON.parse(JSON.stringify(data));
    let current = newData;
    
    for (const key of keys) {
      current = current[key];
    }
    
    current.push('');
    onChange(newData);
  };

  const addObjectProperty = (keys: string[]) => {
    const newData = JSON.parse(JSON.stringify(data));
    let current = newData;
    
    for (const key of keys) {
      current = current[key];
    }
    
    let newKey = 'newKey';
    let counter = 1;
    while (current.hasOwnProperty(newKey)) {
      newKey = `newKey${counter}`;
      counter++;
    }
    
    current[newKey] = '';
    onChange(newData);
  };

  const changeType = (keys: string[], newType: string) => {
    const typeDefaults: Record<string, any> = {
      string: '',
      number: 0,
      boolean: false,
      null: null,
      object: {},
      array: [],
    };
    
    updateValue(keys, typeDefaults[newType]);
  };

  const renameKey = (currentPath: string[], oldKey: string, newKey: string) => {
    if (oldKey === newKey || !newKey.trim()) return;
    
    const newData = JSON.parse(JSON.stringify(data));
    let current = newData;
    
    for (const k of currentPath) {
      current = current[k];
    }
    
    // 检查新 key 是否已存在
    if (current.hasOwnProperty(newKey)) {
      alert(`屬性 "${newKey}" 已存在`);
      // 重置编辑状态
      setEditingKeys((prev) => {
        const newKeys = { ...prev };
        delete newKeys[[...currentPath, oldKey].join('.')];
        return newKeys;
      });
      return;
    }
    
    // 直接在当前对象上重命名（保持顺序）
    const entries = Object.entries(current);
    const keys = Object.keys(current);
    
    // 清空当前对象
    for (const k of keys) {
      delete current[k];
    }
    
    // 重新添加属性，保持顺序
    for (const [k, v] of entries) {
      if (k === oldKey) {
        current[newKey] = v;
      } else {
        current[k] = v;
      }
    }
    
    onChange(newData);
  };

  const renderValue = (value: any, currentPath: string[]): JSX.Element => {
    const pathKey = currentPath.join('.');
    const isExpanded = expanded[pathKey] !== false; // 默认展开

    if (value === null) {
      return (
        <JsonValueInput
          value={null}
          type="null"
          onChange={(newValue) => updateValue(currentPath, newValue)}
          onTypeChange={(newType) => changeType(currentPath, newType)}
          width={240}
        />
      );
    }

    if (typeof value === 'boolean') {
      return (
        <JsonValueInput
          value={value}
          type="boolean"
          onChange={(newValue) => updateValue(currentPath, newValue)}
          onTypeChange={(newType) => changeType(currentPath, newType)}
          width={240}
        />
      );
    }

    if (typeof value === 'number') {
      return (
        <JsonValueInput
          value={value}
          type="number"
          onChange={(newValue) => updateValue(currentPath, newValue)}
          onTypeChange={(newType) => changeType(currentPath, newType)}
          width={240}
        />
      );
    }

    if (typeof value === 'string') {
      return (
        <JsonValueInput
          value={value}
          type="string"
          onChange={(newValue) => updateValue(currentPath, newValue)}
          onTypeChange={(newType) => changeType(currentPath, newType)}
          width={240}
        />
      );
    }

    if (Array.isArray(value)) {
      return (
        <Box>
          <JsonComplexTypeHeader
            type="array"
            length={value.length}
            isExpanded={isExpanded}
            onToggleExpand={() => toggleExpand(pathKey)}
            onAdd={() => addArrayItem(currentPath)}
            onTypeChange={(newType) => changeType(currentPath, newType)}
            onDelete={currentPath.length > 0 ? () => deleteValue(currentPath) : undefined}
            isRootLevel={currentPath.length === 0}
          />
          {isExpanded && (
            <Box sx={{ ml: 4, borderLeft: '2px solid', borderColor: 'divider', pl: 2 }}>
              {value.map((item, index) => {
                const isPrimitive = typeof item !== 'object' || item === null;
                return (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0, mb: 1 }}>
                    <Typography sx={{ fontFamily: 'monospace', color: 'primary.main', lineHeight: '32px', pt: 0, minWidth: 60, mr: 1 }}>
                      [{index}]:
                    </Typography>
                    {isPrimitive ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {renderValue(item, [...currentPath, index.toString()])}
                        <Tooltip title="刪除">
                          <IconButton
                            size="small"
                            onClick={() => deleteValue([...currentPath, index.toString()])}
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
                      </Box>
                    ) : (
                      renderValue(item, [...currentPath, index.toString()])
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      );
    }

    if (typeof value === 'object') {
      const keys = Object.keys(value);
      return (
        <Box>
          <JsonComplexTypeHeader
            type="object"
            length={keys.length}
            isExpanded={isExpanded}
            onToggleExpand={() => toggleExpand(pathKey)}
            onAdd={() => addObjectProperty(currentPath)}
            onTypeChange={(newType) => changeType(currentPath, newType)}
            onDelete={currentPath.length > 0 ? () => deleteValue(currentPath) : undefined}
            isRootLevel={currentPath.length === 0}
          />
          {isExpanded && (
            <Box sx={{ ml: 4, borderLeft: '2px solid', borderColor: 'divider', pl: 2 }}>
              {keys.map((key) => {
                const keyPath = [...currentPath, key].join('.');
                const editingKey = editingKeys[keyPath];
                const displayKey = editingKey !== undefined ? editingKey : key;
                const isPrimitive = typeof value[key] !== 'object' || value[key] === null;
                
                return (
                  <Box key={key} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                    <TextField
                      size="small"
                      value={displayKey}
                      onChange={(e) => {
                        setEditingKeys((prev) => ({
                          ...prev,
                          [keyPath]: e.target.value,
                        }));
                      }}
                      onBlur={() => {
                        if (editingKey !== undefined) {
                          if (editingKey.trim() && editingKey !== key) {
                            renameKey(currentPath, key, editingKey.trim());
                          }
                          // 清除编辑状态
                          setEditingKeys((prev) => {
                            const newKeys = { ...prev };
                            delete newKeys[keyPath];
                            return newKeys;
                          });
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.currentTarget.blur();
                        } else if (e.key === 'Escape') {
                          // 取消编辑，恢复原 key
                          setEditingKeys((prev) => {
                            const newKeys = { ...prev };
                            delete newKeys[keyPath];
                            return newKeys;
                          });
                          e.currentTarget.blur();
                        }
                      }}
                      sx={{ 
                        width: 160,
                        fontFamily: 'monospace',
                        flexShrink: 0,
                        '& .MuiInputBase-root': {
                          height: 32,
                        },
                      }}
                    />
                    <Typography sx={{ lineHeight: '32px', mx: 0.5, flexShrink: 0 }}>:</Typography>
                    {isPrimitive ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {renderValue(value[key], [...currentPath, key])}
                        <Tooltip title="刪除">
                          <IconButton
                            size="small"
                            onClick={() => deleteValue([...currentPath, key])}
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
                      </Box>
                    ) : (
                      renderValue(value[key], [...currentPath, key])
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      );
    }

    return <Typography>Unknown type</Typography>;
  };

  return (
    <Box sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
      {renderValue(data, path)}
    </Box>
  );
}

