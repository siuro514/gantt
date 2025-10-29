const fs = require('fs');
const path = require('path');

// 语言配置
const languages = [
  {
    code: 'en',
    path: 'en',
    i18nCode: 'en',
    htmlLang: 'en',
    title: 'Ganttleman - Free Online Tools Collection | Gantt Chart, JSON, Base64, Image Compressor',
    description: 'Ganttleman - Free online tools collection including Gantt charts, JSON formatter, Base64 encoder/decoder, image compressor and more. Fast, simple, secure and free.',
    keywords: 'online tools,free tools,gantt chart,JSON formatter,Base64,image compressor,productivity tools,developer tools'
  },
  {
    code: 'zh-TW',
    path: 'zh-tw',
    i18nCode: 'zh-TW',
    htmlLang: 'zh-TW',
    title: 'Ganttleman - 免費線上工具集合 | 甘特圖、JSON、Base64、圖片壓縮',
    description: 'Ganttleman - 免費線上工具集合，提供甘特圖、JSON 格式化、Base64 編解碼、圖片壓縮等實用工具。快速、簡單、安全、免費。',
    keywords: '線上工具,免費工具,甘特圖,JSON格式化,Base64,圖片壓縮,效率工具,開發工具'
  },
  {
    code: 'zh-CN',
    path: 'zh-cn',
    i18nCode: 'zh-CN',
    htmlLang: 'zh-CN',
    title: 'Ganttleman - 免费在线工具集合 | 甘特图、JSON、Base64、图片压缩',
    description: 'Ganttleman - 免费在线工具集合，提供甘特图、JSON 格式化、Base64 编解码、图片压缩等实用工具。快速、简单、安全、免费。',
    keywords: '在线工具,免费工具,甘特图,JSON格式化,Base64,图片压缩,效率工具,开发工具'
  },
  {
    code: 'ja',
    path: 'ja',
    i18nCode: 'ja',
    htmlLang: 'ja',
    title: 'Ganttleman - 無料オンラインツールコレクション | ガントチャート、JSON、Base64、画像圧縮',
    description: 'Ganttleman - ガントチャート、JSON フォーマッター、Base64 エンコーダー/デコーダー、画像圧縮などの無料オンラインツールコレクション。高速、シンプル、安全、無料。',
    keywords: 'オンラインツール,無料ツール,ガントチャート,JSONフォーマッター,Base64,画像圧縮,生産性ツール,開発者ツール'
  },
  {
    code: 'ko',
    path: 'ko',
    i18nCode: 'ko',
    htmlLang: 'ko',
    title: 'Ganttleman - 무료 온라인 도구 모음 | 간트 차트, JSON, Base64, 이미지 압축',
    description: 'Ganttleman - 간트 차트, JSON 포맷터, Base64 인코더/디코더, 이미지 압축 등 무료 온라인 도구 모음. 빠르고, 간단하고, 안전하고, 무료입니다.',
    keywords: '온라인 도구,무료 도구,간트 차트,JSON 포맷터,Base64,이미지 압축,생산성 도구,개발자 도구'
  },
  {
    code: 'es',
    path: 'es',
    i18nCode: 'es',
    htmlLang: 'es',
    title: 'Ganttleman - Colección de Herramientas Gratuitas en Línea | Diagrama de Gantt, JSON, Base64, Compresor de Imágenes',
    description: 'Ganttleman - Colección de herramientas en línea gratuitas que incluyen diagramas de Gantt, formateador JSON, codificador/decodificador Base64, compresor de imágenes y más. Rápido, simple, seguro y gratuito.',
    keywords: 'herramientas en línea,herramientas gratuitas,diagrama de gantt,formateador JSON,Base64,compresor de imágenes,herramientas de productividad,herramientas de desarrollo'
  }
];

// 读取模板 HTML
const distPath = path.join(__dirname, '../dist');
const templateHtmlPath = path.join(distPath, 'index.html');

if (!fs.existsSync(templateHtmlPath)) {
  console.error('❌ dist/index.html not found. Please run "npm run build" first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(templateHtmlPath, 'utf-8');

console.log('🌍 Generating language-specific HTML files...\n');

// 为每种语言生成 HTML
languages.forEach(lang => {
  console.log(`📝 Generating ${lang.code} (${lang.path})...`);
  
  // 创建语言目录
  const langDir = path.join(distPath, lang.path);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }
  
  // 替换 HTML 中的 SEO 标签
  let html = templateHtml;
  
  // 替换 lang 属性
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang.htmlLang}"`);
  
  // 替换 title
  html = html.replace(/<title>.*?<\/title>/, `<title>${lang.title}</title>`);
  
  // 替换 meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${lang.description}"`
  );
  
  // 替换 meta keywords
  html = html.replace(
    /<meta name="keywords" content="[^"]*"/,
    `<meta name="keywords" content="${lang.keywords}"`
  );
  
  // 写入文件
  const htmlPath = path.join(langDir, 'index.html');
  fs.writeFileSync(htmlPath, html, 'utf-8');
  
  console.log(`   ✅ Created ${lang.path}/index.html`);
});

console.log('\n✨ All language-specific HTML files generated successfully!\n');
console.log('📁 Structure:');
languages.forEach(lang => {
  console.log(`   - dist/${lang.path}/index.html (${lang.code})`);
});
console.log('\n🔗 URLs:');
languages.forEach(lang => {
  console.log(`   - https://ganttleman.com/${lang.path}/ (${lang.code})`);
});

