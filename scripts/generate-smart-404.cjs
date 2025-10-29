const fs = require('fs');
const path = require('path');

// 读取模板 HTML
const distPath = path.join(__dirname, '../dist');
const templateHtmlPath = path.join(distPath, 'index.html');

if (!fs.existsSync(templateHtmlPath)) {
  console.error('❌ dist/index.html not found.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(templateHtmlPath, 'utf-8');

// 创建智能 404.html，它会根据 URL 路径动态设置语言
const smart404Html = templateHtml.replace(
  '</head>',
  `  <script>
    // 从 URL 中检测语言并更新 document.documentElement.lang
    (function() {
      const pathLangMap = {
        '/en': 'en',
        '/zh-tw': 'zh-TW',
        '/zh-cn': 'zh-CN',
        '/ja': 'ja',
        '/ko': 'ko',
        '/es': 'es'
      };
      
      const path = window.location.pathname;
      for (const [prefix, lang] of Object.entries(pathLangMap)) {
        if (path.startsWith(prefix + '/') || path === prefix) {
          document.documentElement.lang = lang;
          break;
        }
      }
    })();
  </script>
  </head>`
);

// 写入 404.html
const notFoundPath = path.join(distPath, '404.html');
fs.writeFileSync(notFoundPath, smart404Html, 'utf-8');

console.log('✅ 已生成智能 404.html（支持多语言检测）');

