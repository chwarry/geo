/**
 * 日期格式化工具函数
 */

/**
 * 格式化日期为 API 需要的格式: 2025-12-10T14:54:47
 * 不带毫秒和时区后缀
 * @param dateValue 日期值，可以是 Date 对象、字符串或其他
 * @returns 格式化后的日期字符串
 */
export const formatDateForAPI = (dateValue: any): string => {
  if (!dateValue) {
    const now = new Date();
    return now.toISOString().slice(0, 19); // 2025-12-10T14:54:47
  }
  if (typeof dateValue === 'object' && dateValue.toISOString) {
    return dateValue.toISOString().slice(0, 19); // 去掉 .000Z
  }
  if (typeof dateValue === 'string') {
    // 如果已经是正确格式，直接返回
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(dateValue)) {
      return dateValue;
    }
    // 如果带有毫秒和时区，截取
    if (dateValue.includes('.') || dateValue.endsWith('Z')) {
      return dateValue.slice(0, 19);
    }
    // 如果是空格分隔的格式，转换
    if (dateValue.includes(' ') && !dateValue.includes('T')) {
      return dateValue.replace(' ', 'T').slice(0, 19);
    }
    // 如果只有日期没有时间（如 "2025-12-11"），添加默认时间
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return `${dateValue}T00:00:00`;
    }
  }
  return String(dateValue).slice(0, 19);
};

/**
 * 格式化日期为显示格式: 2025-12-10 14:54:47
 * @param dateValue 日期值
 * @returns 格式化后的日期字符串
 */
export const formatDateForDisplay = (dateValue: any): string => {
  if (!dateValue) return '';
  const apiFormat = formatDateForAPI(dateValue);
  return apiFormat.replace('T', ' ');
};

/**
 * 格式化日期为仅日期格式: 2025-12-10
 * @param dateValue 日期值
 * @returns 格式化后的日期字符串
 */
export const formatDateOnly = (dateValue: any): string => {
  if (!dateValue) return '';
  const apiFormat = formatDateForAPI(dateValue);
  return apiFormat.slice(0, 10);
};
