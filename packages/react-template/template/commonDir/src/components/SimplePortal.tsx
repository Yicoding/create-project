import { ReactNode, isValidElement, cloneElement, CSSProperties, ReactElement, useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { isProd } from '@/utils/env';
import { formatStackInfo, StackLineInfo, showError } from '@/components/errorPopup';
import { logError } from '@/utils/log';

interface SimplePortalProps {
  children: ReactNode;
  targetSelector?: string; // 可选属性，默认值通过组件参数定义
}

const SimplePortal = ({
  children,
  targetSelector = '#root'
}: SimplePortalProps) => {
  // 用于存储调用来源信息
  const [stackInfo, setStackInfo] = useState<StackLineInfo[]>([]);
  // 存储完整错误消息
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [container, setContainer] = useState<Element | null>(null);
  // 存储错误弹窗的关闭函数
  const closeErrorRef = useRef<(() => void) | null>(null);

  // 如果找不到目标容器，延迟500ms后再显示错误
  useEffect(() => {
    // 清理之前的错误弹窗，如果有的话
    if (closeErrorRef.current) {
      closeErrorRef.current();
      closeErrorRef.current = null;
    }

    // 检查容器是否存在
    const foundContainer = document.querySelector(targetSelector);
    setContainer(foundContainer);

    // 如果找到了容器，直接返回
    if (foundContainer) {
      return;
    }

    // 容器不存在，准备显示延迟错误
    // 创建错误对象以获取调用栈
    const err = new Error(`SimplePortal Error: 找不到目标容器 "${targetSelector}"`);
    let localStackInfo: StackLineInfo[] = []; // 声明一个局部变量存储堆栈信息

    try {
      // 格式化并保存完整的堆栈信息
      if (err.stack) {
        const formattedStack = formatStackInfo(err.stack);
        // 过滤掉SimplePortal自身的调用行，通常是前2行
        const userStackInfo = formattedStack.slice(1);
        setStackInfo(userStackInfo);
        localStackInfo = userStackInfo; // 保存到局部变量以便在其他地方使用

        // 使用新的日志工具打印错误信息
        logError(
          'SimplePortal 错误',
          `找不到目标容器 "${targetSelector}"，请检查选择器是否正确。`,
          userStackInfo.map(item => ({
            function: item.function,
            url: item.url,
            full: item.full
          }))
        );
      } else {
        logError('SimplePortal 错误', `找不到目标容器 "${targetSelector}"，请检查选择器是否正确。`);
      }

      // 设置错误消息
      setErrorMessage(`找不到目标容器 "${targetSelector}"，请检查选择器是否正确。`);

    } catch (parseErr) {
      logError('SimplePortal 错误', `找不到目标容器 "${targetSelector}"，请检查选择器是否正确。（解析调用栈出错）`);
      console.error('无法解析调用栈:', parseErr);
      setErrorMessage(`找不到目标容器 "${targetSelector}"，请检查选择器是否正确。(无法解析调用栈)`);
    }

    // 在非生产环境中创建错误内容
    if (!isProd) {
      const errorContent = (
        <div>
          {errorMessage || `找不到目标容器 "${targetSelector}"，请检查选择器是否正确。`}
          <div style={{ marginTop: '6px', fontSize: '14px' }}>
            选择器: <code style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '2px 4px', borderRadius: '3px' }}>{targetSelector}</code>
          </div>
        </div>
      );

      // 使用带延迟的显示错误函数
      closeErrorRef.current = showError({
        title: "SimplePortal 错误:",
        errorContent: errorContent,
        stackInfo: localStackInfo,
        delay: 500 // 延迟500ms显示错误
      });
    }

    // 设置一个检测间隔，在延迟期间继续检查容器是否出现
    const checkInterval = setInterval(() => {
      const newContainer = document.querySelector(targetSelector);
      if (newContainer) {
        // 找到容器了，取消错误显示
        if (closeErrorRef.current) {
          closeErrorRef.current();
          closeErrorRef.current = null;
        }
        setContainer(newContainer);
        clearInterval(checkInterval);
      }
    }, 100);

    // 清理函数
    return () => {
      clearInterval(checkInterval);
      if (closeErrorRef.current) {
        closeErrorRef.current();
        closeErrorRef.current = null;
      }
    };
  }, [targetSelector, isProd, errorMessage]);

  // 要应用的样式
  const portalStyles: CSSProperties = {
    maxWidth: '640px',
    margin: '0 auto',
    boxSizing: 'border-box'
  };

  // 将样式应用到children的最外层元素
  let enhancedChildren = children;

  if (isValidElement(children)) {
    // 安全地处理样式合并
    const childStyle = (children as ReactElement).props.style || {};
    enhancedChildren = cloneElement(children as ReactElement, {
      style: {
        ...childStyle,
        ...portalStyles
      }
    });
  }

  // 如果容器不存在，返回 null
  if (!container) {
    return null; // 等待容器出现或错误弹窗显示
  }

  // 容器存在，创建Portal
  return createPortal(enhancedChildren, container);
};

export default SimplePortal;