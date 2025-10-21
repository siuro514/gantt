import { Task, OverlapCheckResult } from '@/types/gantt.types';

/**
 * 檢測同一 member 內，指定位置和寬度是否與其他卡片重疊
 * 並返回建議的 rowIndex
 */
export function detectOverlap(
  tasks: Task[],
  memberId: string,
  startX: number,
  width: number,
  excludeTaskId?: string
): OverlapCheckResult {
  // 過濾出同一 member 的任務（且在甘特圖中，不在暫存區）
  const relevantTasks = tasks.filter(
    (task) =>
      task.memberId === memberId &&
      task.memberId !== null &&
      task.id !== excludeTaskId
  );

  if (relevantTasks.length === 0) {
    return { hasOverlap: false, suggestedRowIndex: 0 };
  }

  // 計算新任務的範圍
  const newStart = startX;
  const newEnd = startX + width;

  // 按 rowIndex 分組檢查每一層
  const rowLayers: Task[][] = [];
  
  relevantTasks.forEach((task) => {
    const layerIndex = task.rowIndex;
    if (!rowLayers[layerIndex]) {
      rowLayers[layerIndex] = [];
    }
    rowLayers[layerIndex].push(task);
  });

  // 檢查每一層是否有空間
  for (let i = 0; i < rowLayers.length + 1; i++) {
    const layer = rowLayers[i] || [];
    let hasConflict = false;

    for (const task of layer) {
      const taskStart = task.startX;
      const taskEnd = task.startX + task.width;

      // 檢查是否重疊
      if (!(newEnd <= taskStart || newStart >= taskEnd)) {
        hasConflict = true;
        break;
      }
    }

    if (!hasConflict) {
      return {
        hasOverlap: i > 0,
        suggestedRowIndex: i,
      };
    }
  }

  // 如果所有層都有衝突，建議新的一層
  return {
    hasOverlap: true,
    suggestedRowIndex: rowLayers.length,
  };
}

/**
 * 計算指定 member 需要的最大行數
 */
export function getMaxRowsForMember(tasks: Task[], memberId: string): number {
  const relevantTasks = tasks.filter((task) => task.memberId === memberId && task.memberId !== null);

  if (relevantTasks.length === 0) return 1;

  const maxRowIndex = Math.max(...relevantTasks.map((task) => task.rowIndex));
  return maxRowIndex + 1;
}

