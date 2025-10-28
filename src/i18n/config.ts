import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻译资源
import en from './locales/en.json';
import zhTW from './locales/zh-TW.json';
import zhCN from './locales/zh-CN.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import es from './locales/es.json';

const resources = {
  en: { translation: en },
  'zh-TW': { translation: zhTW },
  'zh-CN': { translation: zhCN },
  ja: { translation: ja },
  ko: { translation: ko },
  es: { translation: es },
};

i18n
  .use(LanguageDetector) // 自动检测用户语言
  .use(initReactI18next) // 绑定 React
  .init({
    resources,
    fallbackLng: 'zh-TW', // 默认语言
    lng: localStorage.getItem('i18nextLng') || 'zh-TW', // 从 localStorage 读取或使用默认值
    debug: false,
    interpolation: {
      escapeValue: false, // React 已经保护免受 XSS
    },
  });

export default i18n;

