import React, { CSSProperties, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// 定义堆栈信息行的类型
export interface StackLineInfo {
  full: string;
  function: string;
  url: string;
  fileInfo: string;
}

// 错误弹窗组件的属性
interface ErrorPopupProps {
  title: string;
  errorContent: React.ReactNode;
  stackInfo?: StackLineInfo[];
  onClose?: () => void;
}

/**
 * 格式化调用堆栈信息，提取关键部分并美化
 * @param info 原始堆栈信息字符串
 * @returns 格式化后的堆栈信息数组
 */
export const formatStackInfo = (info: string): StackLineInfo[] => {
  if (!info) return [];

  // 分离每一行堆栈信息
  const lines = info.split('\n').filter(line => line.trim().length > 0);

  // 提取格式化后的堆栈行
  const formattedLines = lines.map(line => {
    // 匹配 "at functionName (url)" 格式
    const match = line.match(/at\s+([^\s(]+)?\s*(\(([^)]+)\))?/);

    if (match) {
      const functionName = match[1] || '';
      const url = match[3] || '';

      // 如果有URL，提取相关部分
      if (url) {
        // 尝试提取文件名和行号
        const urlParts = url.split('/');
        const fileWithLine = urlParts[urlParts.length - 1] || '';

        return {
          full: line.trim(),
          function: functionName,
          url: url,
          fileInfo: fileWithLine
        };
      }

      return {
        full: line.trim(),
        function: functionName,
        url: '',
        fileInfo: ''
      };
    }

    // 如果不匹配预期格式，则返回原始行
    return {
      full: line.trim(),
      function: '',
      url: '',
      fileInfo: ''
    };
  });

  return formattedLines;
};

/**
 * 错误弹窗组件
 * 用于显示错误信息和调用堆栈
 */
const ErrorPopupComponent: React.FC<ErrorPopupProps> = ({
  title,
  errorContent,
  stackInfo = [],
  onClose
}) => {
  // 展开更多详情的状态
  const [showFullStack, setShowFullStack] = useState(false);
  // 保存当前视窗高度
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  // 监听窗口大小变化，更新视窗高度
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 错误弹窗样式
  const errorStyles: CSSProperties = {
    padding: '15px 20px',
    margin: '15px 0',
    backgroundColor: '#e74c3c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)',
    position: 'fixed',
    top: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    width: 'auto',
    minWidth: '320px',
    maxWidth: '600px',
    maxHeight: `${viewportHeight * 0.8}px`, // 限制最大高度为视窗高度的80%
    textAlign: 'left',
    lineHeight: '1.5',
    boxSizing: 'border-box',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  // 错误标题样式
  const titleStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    paddingBottom: '8px',
    flexShrink: 0 // 防止标题被压缩
  };

  // 警告图标样式
  const iconStyles: CSSProperties = {
    marginRight: '8px',
    fontSize: '18px',
    flexShrink: 0
  };

  // 内容区域容器样式
  const contentContainerStyles: CSSProperties = {
    overflow: 'auto', // 使内容可滚动
    maxHeight: '100%', // 占用剩余空间
    flexGrow: 1, // 弹性扩展
    paddingRight: '5px', // 为滚动条留出空间
    msOverflowStyle: 'none', // IE 和 Edge
    scrollbarWidth: 'thin', // Firefox
  };

  // 调用堆栈样式
  const stackStyles: CSSProperties = {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#c0392b',
    borderRadius: '6px',
    fontSize: '13px',
    fontFamily: 'SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace',
    lineHeight: '1.6',
    color: '#fff',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)',
    maxWidth: '100%'
  };

  // 调用堆栈标题样式
  const stackTitleStyles: CSSProperties = {
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '10px',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
    paddingBottom: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  // 展开/收起按钮样式
  const toggleButtonStyles: CSSProperties = {
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.9)',
    cursor: 'pointer',
    fontSize: '11px',
    padding: '0 5px',
    textTransform: 'none',
    letterSpacing: 'normal',
    display: 'flex',
    alignItems: 'center'
  };

  // 堆栈行项目样式
  const stackLineStyles: CSSProperties = {
    padding: '8px 10px',
    marginBottom: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: '4px',
    display: 'block',
    borderLeft: '3px solid rgba(255, 255, 255, 0.3)',
    maxWidth: '100%',
    overflow: 'hidden'
  };

  // 函数名称样式
  const functionNameStyles: CSSProperties = {
    fontWeight: 'bold',
    color: '#fff',
    wordBreak: 'normal'
  };

  // 文件信息样式
  const fileInfoStyles: CSSProperties = {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '11px',
    display: 'block',
    marginTop: '4px',
    paddingLeft: '12px',
    wordBreak: 'break-all',
    wordWrap: 'break-word',
    lineHeight: '1.4',
    maxWidth: '100%'
  };

  // 优化URL显示的函数 - 在小屏幕和大屏幕都有良好显示
  const formatPath = (url: string): React.ReactElement => {
    // 提取URL各部分
    let match = url.match(/^(https?:\/\/[^\/]+)(.*)$/);

    if (!match) return <>{url}</>;

    const [, domain, path] = match;

    // 进一步拆分路径部分，让它能更好地断行
    const pathParts = path.split('/').filter(Boolean);

    return (
      <>
        <span style={{ opacity: 0.8 }}>{domain}/</span>
        {pathParts.map((part, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ opacity: 0.7 }}>/</span>}
            <span>{part}</span>
          </React.Fragment>
        ))}
      </>
    );
  };

  // 关闭按钮样式
  const closeButtonStyles: CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.8)',
    padding: '0 5px',
    background: 'none',
    border: 'none',
    outline: 'none',
    transition: 'color 0.2s ease',
    zIndex: 1
  };

  // 自适应屏幕宽度
  const getPopupWidth = (): CSSProperties => {
    // 移动设备使用更宽的比例
    if (window.innerWidth <= 480) {
      return {
        width: '90%',
        maxWidth: '600px',
        minWidth: '300px'
      };
    }

    // 平板和桌面设备使用固定宽度
    return {
      width: '600px',
      maxWidth: '600px',
      minWidth: '300px'
    };
  };

  // 合并样式
  const responsiveStyles = {
    ...errorStyles,
    ...getPopupWidth()
  };

  // 确定要显示的堆栈行数
  const displayedStackInfo = showFullStack ? stackInfo : stackInfo.slice(0, 3);
  const hasMoreStackInfo = stackInfo.length > 3;

  // 自定义滚动条样式
  const scrollbarStyles = `
    .error-popup-content::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .error-popup-content::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 3px;
    }
    .error-popup-content::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 3px;
    }
    .error-popup-content::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  `;

  return (
    <div style={responsiveStyles}>
      <style>{scrollbarStyles}</style>
      {onClose && (
        <button
          style={closeButtonStyles}
          onClick={onClose}
          aria-label="关闭"
          onMouseOver={(e) => {
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
          }}
        >
          ✕
        </button>
      )}

      <div style={titleStyles}>
        <span role="img" aria-label="警告" style={iconStyles}>⚠️</span>
        <span style={{ wordBreak: 'break-word' }}>{title}</span>
      </div>

      <div
        className="error-popup-content"
        style={contentContainerStyles}
      >
        <div style={{ wordBreak: 'break-word' }}>{errorContent}</div>

        {stackInfo.length > 0 && (
          <div style={stackStyles}>
            <div style={stackTitleStyles}>
              <span>调用位置</span>
              {hasMoreStackInfo && (
                <button
                  onClick={() => setShowFullStack(!showFullStack)}
                  style={toggleButtonStyles}
                  aria-label={showFullStack ? "收起" : "展开更多"}
                >
                  {showFullStack ? "收起" : "展开更多"}
                  <span style={{ marginLeft: '3px', fontSize: '10px' }}>
                    {showFullStack ? "▲" : "▼"}
                  </span>
                </button>
              )}
            </div>
            <div>
              {displayedStackInfo.map((line: StackLineInfo, index: number) => (
                <div key={index} style={stackLineStyles}>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)', marginRight: '6px' }}>•</span>
                    <span style={functionNameStyles}>
                      {line.function || '(匿名函数)'}
                    </span>
                  </div>
                  {line.url && (
                    <div style={fileInfoStyles}>
                      {formatPath(line.url)}
                    </div>
                  )}
                </div>
              ))}
              {!showFullStack && hasMoreStackInfo && (
                <div style={{
                  textAlign: 'center',
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginTop: '5px'
                }}>
                  还有 {stackInfo.length - displayedStackInfo.length} 行未显示
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface ShowErrorOptions {
  title: string;
  errorContent: string | React.ReactNode;
  stackInfo?: StackLineInfo[];
  duration?: number; // 自动消失时间，单位毫秒，默认不自动消失
  container?: HTMLElement; // 渲染容器，默认为 body
  delay?: number; // 延迟显示时间，单位毫秒，默认为0（立即显示）
}

// 创建容器的函数
const createContainer = (): HTMLDivElement => {
  const container = document.createElement('div');
  container.className = 'error-popup-container';
  document.body.appendChild(container);
  return container;
};

// 存储所有当前显示的错误弹窗信息
interface PopupInfo {
  container: HTMLDivElement;
  root: ReactDOM.Root;
  timer?: NodeJS.Timeout;
}

// 存储所有当前显示的错误弹窗
const activeErrorPopups: PopupInfo[] = [];

/**
 * 显示错误弹窗
 * @param options 弹窗配置选项
 * @returns 一个可以用来关闭弹窗的函数
 */
export const showError = (options: ShowErrorOptions) => {
  // 首先关闭所有现有的错误弹窗
  closeAllErrors();

  const {
    title,
    errorContent,
    stackInfo = [],
    duration,
    delay = 0 // 新增延迟参数，默认为0（立即显示）
  } = options;

  // 创建一个函数来处理实际的弹窗创建
  const createPopup = () => {
    // 创建一个新容器
    const popupContainer = createContainer();

    // 创建root
    const root = ReactDOM.createRoot(popupContainer);

    // 渲染错误弹窗
    const handleClose = () => {
      // 找到当前弹窗在列表中的索引
      const index = activeErrorPopups.findIndex(item => item.container === popupContainer);

      // 如果找到了，从活动列表中移除
      if (index !== -1) {
        // 清除可能存在的定时器
        if (activeErrorPopups[index].timer) {
          clearTimeout(activeErrorPopups[index].timer);
        }
        activeErrorPopups.splice(index, 1);
      }

      // 卸载组件
      root.unmount();

      // 从DOM中移除容器
      if (popupContainer.parentNode) {
        popupContainer.parentNode.removeChild(popupContainer);
      }
    };

    // 创建错误弹窗元素
    const errorPopupElement = (
      <ErrorPopupComponent
        title={title}
        errorContent={errorContent}
        stackInfo={stackInfo}
        onClose={handleClose}
      />
    );

    // 渲染组件
    root.render(errorPopupElement);

    // 添加到活动弹窗列表
    const popupInfo: PopupInfo = {
      container: popupContainer,
      root,
      timer: undefined
    };
    activeErrorPopups.push(popupInfo);

    // 如果设置了自动关闭时间
    if (duration && duration > 0) {
      popupInfo.timer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    // 返回关闭函数，以便调用者可以手动关闭
    return handleClose;
  };

  // 如果设置了延迟显示
  if (delay > 0) {
    // 返回一个包含延迟逻辑的函数
    const delayTimer = setTimeout(createPopup, delay);

    // 返回一个函数，可以取消延迟显示或关闭已显示的弹窗
    return () => {
      // 如果弹窗尚未显示，清除延迟计时器
      clearTimeout(delayTimer);

      // 关闭可能已经显示的弹窗
      closeAllErrors();
    };
  } else {
    // 没有延迟，立即显示
    return createPopup();
  }
};

/**
 * 关闭所有当前显示的错误弹窗
 */
export const closeAllErrors = () => {
  // 复制数组，因为在迭代过程中会修改原数组
  const popupsCopy = [...activeErrorPopups];

  // 关闭所有弹窗
  popupsCopy.forEach(popup => {
    // 清除可能存在的定时器
    if (popup.timer) {
      clearTimeout(popup.timer);
    }

    // 卸载组件
    popup.root.unmount();

    // 从DOM中移除容器
    if (popup.container.parentNode) {
      popup.container.parentNode.removeChild(popup.container);
    }
  });

  // 清空活动弹窗列表
  activeErrorPopups.length = 0;
};

/**
 * 格式化错误对象，提取有用的堆栈信息
 * @param error 错误对象
 * @returns 格式化后的堆栈信息
 */
export const formatError = (error: Error): StackLineInfo[] => {
  if (!error.stack) return [];

  // 直接使用本文件中定义的 formatStackInfo 函数
  return formatStackInfo(error.stack);
};

// 简化的错误显示方法
export const showErrorMessage = (message: string, title = '错误') => {
  return showError({
    title,
    errorContent: message
  });
};

// 从错误对象直接创建错误弹窗
export const showErrorFromException = (error: Error, title = '发生错误') => {
  const stackInfo = formatError(error);

  return showError({
    title,
    errorContent: error.message,
    stackInfo
  });
};

// 默认导出所有方法
export default {
  showError,
  showErrorMessage,
  showErrorFromException,
  closeAllErrors,
  formatError,
  formatStackInfo
}; 