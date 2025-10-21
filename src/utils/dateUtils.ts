import { format, parseISO } from 'date-fns';
import { zhTW } from 'date-fns/locale';

/**
 * 格式化日期為 YYYY/MM/DD
 */
export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'yyyy/MM/dd', { locale: zhTW });
  } catch {
    return dateString;
  }
}

/**
 * 格式化日期為 MM/DD
 */
export function formatDateShort(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'MM/dd', { locale: zhTW });
  } catch {
    return dateString;
  }
}

/**
 * 獲取當前日期的 ISO 字串
 */
export function getCurrentDateISO(): string {
  return new Date().toISOString().split('T')[0];
}

