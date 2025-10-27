import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// 自動生成 404.html 的插件（用於 GitHub Pages SPA 路由）
function generate404Plugin() {
  return {
    name: 'generate-404',
    closeBundle() {
      const distPath = path.resolve(__dirname, 'dist');
      const indexPath = path.join(distPath, 'index.html');
      const notFoundPath = path.join(distPath, '404.html');
      
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, notFoundPath);
        console.log('✅ 已生成 404.html（複製自 index.html）');
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), generate404Plugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/', // 使用絕對路徑，確保子路由能正確加載資源
  build: {
    outDir: 'dist',
  },
});

