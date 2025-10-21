export interface Sprint {
  id: string;
  title: string;
  startDate: string; // ISO format
  endDate: string; // ISO format
  color: string; // 莫蘭迪色碼
  order: number;
}

export interface Member {
  id: string;
  name: string;
  order: number;
}

export interface Task {
  id: string;
  title: string;
  memberId: string | null; // null = 在暫存區
  startX: number; // 絕對橫向起始位置（像素）
  width: number; // 寬度（像素）
  rowIndex: number; // 垂直位置（處理重疊）
  storageOrder?: number; // 暫存區排序
  backgroundColor?: string; // 卡片背景顏色
}

export interface GanttState {
  sprints: Sprint[];
  members: Member[];
  tasks: Task[];
  projectTitle: string;
  primaryColor: string;
}

export interface OverlapCheckResult {
  hasOverlap: boolean;
  suggestedRowIndex: number;
}

