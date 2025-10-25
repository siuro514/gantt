import { useState, useEffect } from 'react';
import { AppBar, Toolbar as MuiToolbar, IconButton, Box, Tooltip, Popover, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PaletteIcon from '@mui/icons-material/Palette';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useGanttStore } from '@/store/ganttStore';
import EditableText from '../common/EditableText';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { nanoid } from 'nanoid';
import { DEFAULT_SPRINT_COLOR } from '@/utils/colors';

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

export default function Toolbar() {
  const { exportData, loadData, projectTitle, updateProjectTitle, primaryColor, updatePrimaryColor, tasks } = useGanttStore();
  const [colorPickerAnchor, setColorPickerAnchor] = useState<HTMLElement | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  // 監聽 undo/redo 狀態變化
  useEffect(() => {
    const updateUndoRedoState = () => {
      const { pastStates, futureStates } = useGanttStore.temporal.getState();
      setCanUndo(pastStates.length > 0);
      setCanRedo(futureStates.length > 0);
    };

    // 初始化
    updateUndoRedoState();

    // 訂閱主 store 變化
    const unsubscribeMain = useGanttStore.subscribe(updateUndoRedoState);
    // 訂閱 temporal store 變化
    const unsubscribeTemporal = useGanttStore.temporal.subscribe(updateUndoRedoState);
    
    return () => {
      unsubscribeMain();
      unsubscribeTemporal();
    };
  }, []);

  // 獲取 undo/redo 方法
  const handleUndo = () => {
    useGanttStore.temporal.getState().undo();
  };

  const handleRedo = () => {
    useGanttStore.temporal.getState().redo();
  };

  const handleColorPickerClose = () => {
    setColorPickerAnchor(null);
  };

  const handleClearAll = () => {
    // 重置到初始狀態，包含一個預設 Sprint 和 Member
    const now = new Date();
    const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    // 暫停歷史記錄，避免清空操作記錄到 undo 歷史
    useGanttStore.temporal.getState().pause();
    loadData({
      sprints: [
        {
          id: nanoid(),
          title: 'Sprint 1',
          startDate: now.toISOString().split('T')[0],
          endDate: twoWeeksLater.toISOString().split('T')[0],
          color: DEFAULT_SPRINT_COLOR,
          order: 0,
        },
      ],
      members: [
        {
          id: nanoid(),
          name: 'Member 1',
          order: 0,
        },
      ],
      tasks: [],
      projectTitle: 'Gantt Chart - 團隊任務管理',
      primaryColor: '#6750A4',
    });
    // 清空 undo/redo 歷史，從清空後的狀態開始
    useGanttStore.temporal.getState().clear();
    useGanttStore.temporal.getState().resume();
    setClearDialogOpen(false);
  };

  const handleExportPNG = async () => {
    const scrollContainer = document.getElementById('gantt-scroll-container');
    const boardElement = document.getElementById('gantt-board');
    if (!scrollContainer || !boardElement) return;

    try {
      // 關閉所有調色盤
      handleColorPickerClose();
      
      // 保存原始狀態
      const originalOverflow = scrollContainer.style.overflow;
      const originalMaxHeight = scrollContainer.style.maxHeight;
      const originalFlex = scrollContainer.style.flex;
      const originalBoardHeight = boardElement.style.height;
      const originalBoardWidth = boardElement.style.width;
      
      // 添加導出模式的 data attribute，用於隱藏操作按鈕
      boardElement.setAttribute('data-exporting', 'true');
      
      // 暫時移除所有限制，讓所有內容完全展開（包含橫向）
      scrollContainer.style.overflow = 'visible';
      scrollContainer.style.maxHeight = 'none';
      scrollContainer.style.flex = 'none';
      boardElement.style.height = 'auto';
      boardElement.style.width = 'auto';
      
      // 等待 DOM 更新
      await new Promise(resolve => setTimeout(resolve, 300));

      // 獲取整個 board 的實際尺寸（包含所有橫向滾動的 sprint）
      const actualHeight = boardElement.scrollHeight;
      const actualWidth = boardElement.scrollWidth;

      console.log('Export dimensions:', { 
        actualWidth, 
        actualHeight,
        scrollWidth: scrollContainer.scrollWidth,
        scrollHeight: scrollContainer.scrollHeight 
      });

      const canvas = await html2canvas(boardElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
        width: actualWidth,
        height: actualHeight,
        windowWidth: actualWidth,
        windowHeight: actualHeight,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
      });

      // 恢復原始狀態
      boardElement.removeAttribute('data-exporting');
      scrollContainer.style.overflow = originalOverflow;
      scrollContainer.style.maxHeight = originalMaxHeight;
      scrollContainer.style.flex = originalFlex;
      boardElement.style.height = originalBoardHeight;
      boardElement.style.width = originalBoardWidth;

      const link = document.createElement('a');
      link.download = `gantt-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Failed to export PNG:', error);
      
      // 確保恢復原始狀態
      const scrollContainer = document.getElementById('gantt-scroll-container');
      const boardElement = document.getElementById('gantt-board');
      if (scrollContainer) {
        scrollContainer.style.overflow = 'auto';
        scrollContainer.style.maxHeight = '';
        scrollContainer.style.flex = '1';
      }
      if (boardElement) {
        boardElement.removeAttribute('data-exporting');
        boardElement.style.height = '';
        boardElement.style.width = '';
      }
    }
  };

  const handleExportPDF = async () => {
    const scrollContainer = document.getElementById('gantt-scroll-container');
    const boardElement = document.getElementById('gantt-board');
    if (!scrollContainer || !boardElement) return;

    try {
      // 關閉所有調色盤
      handleColorPickerClose();
      
      // 保存原始狀態
      const originalOverflow = scrollContainer.style.overflow;
      const originalMaxHeight = scrollContainer.style.maxHeight;
      const originalFlex = scrollContainer.style.flex;
      const originalBoardHeight = boardElement.style.height;
      const originalBoardWidth = boardElement.style.width;
      
      // 添加導出模式
      boardElement.setAttribute('data-exporting', 'true');
      
      // 暫時移除所有限制
      scrollContainer.style.overflow = 'visible';
      scrollContainer.style.maxHeight = 'none';
      scrollContainer.style.flex = 'none';
      boardElement.style.height = 'auto';
      boardElement.style.width = 'auto';
      
      // 等待 DOM 更新
      await new Promise(resolve => setTimeout(resolve, 300));

      // 獲取實際尺寸
      const actualHeight = boardElement.scrollHeight;
      const actualWidth = boardElement.scrollWidth;

      // 收集所有有超連結的卡片位置（在截圖前）
      const taskLinks: Array<{ x: number; y: number; width: number; height: number; url: string }> = [];
      tasks.forEach(task => {
        if (task.url && task.memberId) {
          const taskElements = document.querySelectorAll(`[data-task-id="${task.id}"]`);
          if (taskElements.length > 0) {
            const taskElement = taskElements[0] as HTMLElement;
            const rect = taskElement.getBoundingClientRect();
            const boardRect = boardElement.getBoundingClientRect();
            
            taskLinks.push({
              x: rect.left - boardRect.left,
              y: rect.top - boardRect.top,
              width: rect.width,
              height: rect.height,
              url: task.url,
            });
          }
        }
      });

      // 生成截圖
      const canvas = await html2canvas(boardElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
        width: actualWidth,
        height: actualHeight,
        windowWidth: actualWidth,
        windowHeight: actualHeight,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
      });

      // 恢復原始狀態
      boardElement.removeAttribute('data-exporting');
      scrollContainer.style.overflow = originalOverflow;
      scrollContainer.style.maxHeight = originalMaxHeight;
      scrollContainer.style.flex = originalFlex;
      boardElement.style.height = originalBoardHeight;
      boardElement.style.width = originalBoardWidth;

      // 創建 PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: actualWidth > actualHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [actualWidth, actualHeight],
      });

      // 添加圖片到 PDF
      pdf.addImage(imgData, 'PNG', 0, 0, actualWidth, actualHeight);

      // 添加超連結（使用之前收集的位置）
      taskLinks.forEach(link => {
        pdf.link(link.x, link.y, link.width, link.height, { url: link.url });
      });

      // 下載 PDF
      pdf.save(`gantt-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      
      // 確保恢復原始狀態
      const scrollContainer = document.getElementById('gantt-scroll-container');
      const boardElement = document.getElementById('gantt-board');
      if (scrollContainer) {
        scrollContainer.style.overflow = 'auto';
        scrollContainer.style.maxHeight = '';
        scrollContainer.style.flex = '1';
      }
      if (boardElement) {
        boardElement.removeAttribute('data-exporting');
        boardElement.style.height = '';
        boardElement.style.width = '';
      }
    }
  };

  const handleExportJSON = () => {
    const data = exportData();
    const json = JSON.stringify(
      {
        ...data,
        version: '1.0',
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );

    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `gantt-data-${Date.now()}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.sprints && data.members && data.tasks) {
            // 暫停歷史記錄，避免導入數據時記錄到 undo 歷史
            useGanttStore.temporal.getState().pause();
            loadData({
              sprints: data.sprints,
              members: data.members,
              tasks: data.tasks,
              projectTitle: data.projectTitle || 'Gantt Chart - 團隊任務管理',
              primaryColor: data.primaryColor || '#6750A4',
            });
            // 清空 undo/redo 歷史，從導入的狀態開始
            useGanttStore.temporal.getState().clear();
            useGanttStore.temporal.getState().resume();
          } else {
            alert('Invalid file format');
          }
        } catch (error) {
          console.error('Failed to import JSON:', error);
          alert('Failed to import file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'primary.main' }}>
      <MuiToolbar sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ flexGrow: 1, minWidth: 200 }}>
          <EditableText
            value={projectTitle}
            onChange={updateProjectTitle}
            variant="h6"
            placeholder="Project Title"
            sx={{
              color: 'inherit',
              '& .MuiInputBase-input': {
                color: 'inherit',
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Tooltip title="清除所有資料">
            <IconButton color="inherit" onClick={() => setClearDialogOpen(true)}>
              <DeleteSweepIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="復原 (Cmd+Z)">
            <span>
              <IconButton color="inherit" onClick={handleUndo} disabled={!canUndo}>
                <UndoIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="重做 (Cmd+Shift+Z)">
            <span>
              <IconButton color="inherit" onClick={handleRedo} disabled={!canRedo}>
                <RedoIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="匯出 PNG">
            <IconButton color="inherit" onClick={handleExportPNG}>
              <ImageIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="匯出 PDF（支援超連結）">
            <IconButton color="inherit" onClick={handleExportPDF}>
              <PictureAsPdfIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="匯出 JSON">
            <IconButton color="inherit" onClick={handleExportJSON}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="匯入 JSON">
            <IconButton color="inherit" onClick={handleImportJSON}>
              <UploadIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="更改主題顏色">
            <IconButton 
              color="inherit" 
              onClick={(e) => setColorPickerAnchor(e.currentTarget)}
            >
              <PaletteIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* 顏色選擇器 Popover */}
        <Popover
          open={Boolean(colorPickerAnchor)}
          anchorEl={colorPickerAnchor}
          onClose={() => setColorPickerAnchor(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box sx={{ p: 2.5, maxHeight: 450, overflow: 'auto' }}>
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
                    width: 36,
                    height: 36,
                    backgroundColor: color,
                    border: primaryColor === color ? '3px solid transparent' : '1px solid #e0e0e0',
                    borderRadius: 1.5,
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

        {/* 清除確認對話框 */}
        <Dialog
          open={clearDialogOpen}
          onClose={() => setClearDialogOpen(false)}
        >
          <DialogTitle>清除所有資料</DialogTitle>
          <DialogContent>
            <DialogContentText>
              確定要清除所有資料嗎？這將刪除所有 Sprint、Member 和 Task，並且無法復原。
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setClearDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleClearAll} color="error" variant="contained">
              確定清除
            </Button>
          </DialogActions>
        </Dialog>
      </MuiToolbar>
    </AppBar>
  );
}

