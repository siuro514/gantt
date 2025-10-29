import { useState, useEffect } from 'react';
import { AppBar, Toolbar as MuiToolbar, IconButton, Box, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useGanttStore } from '@/store/ganttStore';
import EditableText from '../common/EditableText';
import ThemeColorPicker from '../ThemeColorPicker';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { nanoid } from 'nanoid';
import { DEFAULT_SPRINT_COLOR } from '@/utils/colors';
import { useTranslation } from 'react-i18next';

export default function Toolbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { exportData, loadData, projectTitle, updateProjectTitle, tasks } = useGanttStore();
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
          title: t('gantt.defaults.sprintName', { number: 1 }),
          startDate: now.toISOString().split('T')[0],
          endDate: twoWeeksLater.toISOString().split('T')[0],
          color: DEFAULT_SPRINT_COLOR,
          order: 0,
        },
      ],
      members: [
        {
          id: nanoid(),
          name: t('gantt.defaults.memberName', { number: 1 }),
          order: 0,
        },
      ],
      tasks: [],
      projectTitle: t('gantt.defaults.projectTitle'),
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
              projectTitle: data.projectTitle || t('gantt.defaults.projectTitle'),
              primaryColor: data.primaryColor || '#6750A4',
            });
            // 清空 undo/redo 歷史，從導入的狀態開始
            useGanttStore.temporal.getState().clear();
            useGanttStore.temporal.getState().resume();
          } else {
            alert(t('gantt.toolbar.importError.invalidFormat'));
          }
        } catch (error) {
          console.error('Failed to import JSON:', error);
          alert(t('gantt.toolbar.importError.failed'));
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'primary.main' }}>
      <MuiToolbar sx={{ flexWrap: 'wrap', gap: 1 }}>
        <Tooltip title={t('gantt.toolbar.back')}>
          <IconButton 
            color="inherit" 
            onClick={() => navigate('/')}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>

        <Box sx={{ flexGrow: 1, minWidth: 200 }}>
          <EditableText
            value={projectTitle}
            onChange={updateProjectTitle}
            variant="h6"
            placeholder={t('gantt.toolbar.projectTitle')}
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
          <Tooltip title={t('gantt.toolbar.clearAll')}>
            <IconButton color="inherit" onClick={() => setClearDialogOpen(true)}>
              <DeleteSweepIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('gantt.toolbar.undo')}>
            <span>
              <IconButton color="inherit" onClick={handleUndo} disabled={!canUndo}>
                <UndoIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={t('gantt.toolbar.redo')}>
            <span>
              <IconButton color="inherit" onClick={handleRedo} disabled={!canRedo}>
                <RedoIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title={t('gantt.toolbar.exportPNG')}>
            <IconButton color="inherit" onClick={handleExportPNG}>
              <ImageIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('gantt.toolbar.exportPDF')}>
            <IconButton color="inherit" onClick={handleExportPDF}>
              <PictureAsPdfIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('gantt.toolbar.exportJSON')}>
            <IconButton color="inherit" onClick={handleExportJSON}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t('gantt.toolbar.importJSON')}>
            <IconButton color="inherit" onClick={handleImportJSON}>
              <UploadIcon />
            </IconButton>
          </Tooltip>

          {/* 主題顏色選擇器 - 僅影響甘特圖 */}
          <ThemeColorPicker />
        </Box>

        {/* 清除確認對話框 */}
        <Dialog
          open={clearDialogOpen}
          onClose={() => setClearDialogOpen(false)}
        >
          <DialogTitle>{t('gantt.toolbar.clearDialog.title')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('gantt.toolbar.clearDialog.content')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setClearDialogOpen(false)}>
              {t('gantt.toolbar.clearDialog.cancel')}
            </Button>
            <Button onClick={handleClearAll} color="error" variant="contained">
              {t('gantt.toolbar.clearDialog.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </MuiToolbar>
    </AppBar>
  );
}

