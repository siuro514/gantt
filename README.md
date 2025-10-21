# Gantt Chart - 團隊任務管理

一個現代化的甘特圖工具，用於團隊任務管理和時程規劃。

## ✨ 特性

- 🎨 Material 3 設計風格
- 📅 可視化的 Sprint 時程管理
- 👥 成員任務分配
- 🎯 拖放式任務編輯
- 🎨 自定義顏色主題
- 💾 本地數據持久化
- ↩️ Undo/Redo 功能
- 📤 導出為 PNG/JSON
- 📱 支持橫向滾動

## 🚀 快速開始

### 在線使用

訪問 GitHub Pages 部署的版本（自動部署）

### 本地運行

1. 克隆倉庫
```bash
git clone <your-repo-url>
cd gannt2
```

2. 安裝依賴
```bash
npm install
```

3. 啟動開發服務器
```bash
npm run dev
```

4. 打開瀏覽器訪問 `http://localhost:5173`

### 構建靜態文件

```bash
npm run build
```

構建完成後，`dist` 目錄中的文件可以直接部署到任何靜態文件服務器或直接用瀏覽器打開 `index.html`。

## 📦 部署到 GitHub Pages

1. 在 GitHub 倉庫設置中啟用 GitHub Pages
   - 進入 Settings > Pages
   - Source 選擇 "GitHub Actions"

2. 推送代碼到 main 分支
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

3. GitHub Actions 會自動構建並部署到 GitHub Pages

## 🛠️ 技術棧

- **Frontend Framework**: React 18 + TypeScript
- **UI Library**: Material-UI v6
- **State Management**: Zustand + Zundo
- **Drag & Drop**: @dnd-kit
- **Date Handling**: date-fns + @mui/x-date-pickers
- **Image Export**: html2canvas
- **Build Tool**: Vite

## 📝 使用說明

### Sprint 管理
- 點擊 Sprint 標題編輯名稱
- 點擊日期範圍編輯時程
- 使用調色盤更改 Sprint 顏色
- 在 Sprint 之間插入新的 Sprint

### 成員管理
- 點擊成員名稱編輯
- 拖動圖標調整成員順序
- 在成員之間插入新成員

### 任務卡片
- 從暫存區拖動任務到成員行
- 拖動邊緣調整任務寬度
- 拖動任務卡片重新分配
- 使用調色盤自定義卡片顏色

### 其他功能
- 使用 Undo/Redo 撤銷操作
- 導出為 PNG 圖片
- 導出/導入 JSON 數據
- 自定義主題顏色

## 📄 授權

MIT License

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！
