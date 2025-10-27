export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  color: string;
}

export const tools: Tool[] = [
  {
    id: 'gantt',
    name: '人力資源甘特圖',
    description: '視覺化團隊任務管理和時程規劃工具，支援拖放編輯、PDF 匯出等功能',
    icon: '📊',
    path: '/tools/gantt',
    color: '#6750A4',
  },
  {
    id: 'json-parser',
    name: 'JSON 格式化工具',
    description: '格式化、驗證和美化 JSON 資料，支援語法高亮和錯誤檢測',
    icon: '📝',
    path: '/tools/json-parser',
    color: '#2196F3',
  },
  {
    id: 'base64',
    name: 'Base64 編碼/解碼',
    description: '快速進行 Base64 編碼和解碼，支援文字和圖片格式',
    icon: '🔐',
    path: '/tools/base64',
    color: '#4CAF50',
  },
  {
    id: 'image-compressor',
    name: '圖片壓縮工具',
    description: '在線壓縮圖片大小，保持良好畫質，支援 JPG、PNG、WebP 格式',
    icon: '🖼️',
    path: '/tools/image-compressor',
    color: '#FF9800',
  },
];

