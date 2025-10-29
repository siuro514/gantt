import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// 支持的语言列表
export const SUPPORTED_LANGUAGES = ['en', 'zh-tw', 'zh-cn', 'ja', 'ko', 'es'];
export const DEFAULT_LANGUAGE = 'en';

// 语言路径映射（URL 路径 -> i18n 语言代码）
export const LANG_PATH_MAP: Record<string, string> = {
  'en': 'en',
  'zh-tw': 'zh-TW',
  'zh-cn': 'zh-CN',
  'ja': 'ja',
  'ko': 'ko',
  'es': 'es',
};

// 反向映射（i18n 语言代码 -> URL 路径）
export const LANG_CODE_TO_PATH: Record<string, string> = {
  'en': 'en',
  'zh-TW': 'zh-tw',
  'zh-CN': 'zh-cn',
  'ja': 'ja',
  'ko': 'ko',
  'es': 'es',
};

/**
 * 语言路由包装组件
 * 用于：
 * 1. 从 URL 中提取语言参数
 * 2. 同步 URL 语言与 i18n 语言
 * 3. 处理无效语言的重定向
 */
export function LanguageRouter({ children }: { children: React.ReactNode }) {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 如果 URL 中有语言参数
    if (lang) {
      // 检查是否是支持的语言
      if (SUPPORTED_LANGUAGES.includes(lang)) {
        // 将 URL 语言转换为 i18n 语言代码
        const i18nLang = LANG_PATH_MAP[lang];
        
        // 如果当前 i18n 语言与 URL 语言不同，更新 i18n
        if (i18n.language !== i18nLang) {
          i18n.changeLanguage(i18nLang);
          localStorage.setItem('i18nextLng', i18nLang);
        }
      } else {
        // 不支持的语言，重定向到英文版本
        const newPath = location.pathname.replace(`/${lang}`, '/en');
        navigate(newPath, { replace: true });
      }
    }
  }, [lang, i18n, navigate, location.pathname]);

  return <>{children}</>;
}

/**
 * 根路径重定向组件
 * 检测用户的首选语言并重定向到对应的语言版本
 */
export function RootRedirect() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // 获取用户的语言偏好
    let userLang = i18n.language || DEFAULT_LANGUAGE;
    
    // 转换为 URL 路径格式
    const langPath = LANG_CODE_TO_PATH[userLang] || DEFAULT_LANGUAGE;
    
    // 重定向到对应的语言首页
    navigate(`/${langPath}/`, { replace: true });
  }, [i18n.language, navigate]);

  return null;
}

/**
 * 获取带语言前缀的路径
 */
export function getLocalizedPath(path: string, lang?: string): string {
  const { i18n } = useTranslation();
  const currentLang = lang || i18n.language;
  const langPath = LANG_CODE_TO_PATH[currentLang] || DEFAULT_LANGUAGE;
  
  // 移除开头的斜杠（如果有）
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `/${langPath}/${cleanPath}`;
}

