/**
 * 输出错误日志，包含调用栈信息
 * @param title 错误标题
 * @param message 错误消息
 * @param stack 调用栈信息（可选）
 * @param customStyles 自定义样式（可选）
 */
export function logError(
  title: string,
  message: string,
  stack?: any[],
  customStyles?: any
): void {
  const styles = customStyles || {
    labelBg: '#e74c3c',
    labelColor: 'white',
    textColor: '#e74c3c'
  };

  // 获取时间戳
  const now = new Date();
  const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

  // 获取调用源
  let source = '';
  try {
    const err = new Error();
    const stackLines = err.stack?.split('\n') || [];
    const callerLine = stackLines[3] || '';
    const match = callerLine.match(/\(([^)]+)\)/) || callerLine.match(/at\s+(.+)$/);
    if (match && match[1]) {
      const pathParts = match[1].split('/');
      source = pathParts.slice(-2).join('/');
    }
  } catch (e) {
    // 忽略错误
  }

  // 构建完整日志前缀
  let fullLabel = title;
  fullLabel = `[${timestamp}] ${fullLabel}`;
  if (source) {
    fullLabel = `${fullLabel} (${source})`;
  }

  // 输出主要错误信息
  console.log(
    `%c ${fullLabel} %c ${message}`,
    `background: ${styles.labelBg}; color: ${styles.labelColor}; padding: 2px 6px; border-radius: 3px; font-weight: bold;`,
    `color: ${styles.textColor}; font-weight: bold;`
  );

  // 如果有调用栈，则输出调用栈信息
  if (stack && stack.length > 0) {
    console.group(`%c详细调用堆栈`, `color: ${styles.textColor}; font-weight: bold; font-size: 12px;`);

    stack.forEach((item, index) => {
      if (item.function) {
        console.log(
          `%c${index + 1}.%c ${item.function}%c ${item.url ? `(${item.url})` : ''}`,
          'color: #95a5a6; font-weight: bold; margin-right: 5px;',
          'font-weight: bold; color: #2980b9;',
          'color: #7f8c8d;'
        );
      } else if (item.full) {
        console.log(`${index + 1}. ${item.full}`);
      }
    });

    console.groupEnd();
  }
}

// 默认导出仅包含 logError 方法
export default logError; 