import { Toast } from 'antd-mobile';

interface Params {
  text: string;
  showToast?: boolean;
  duration?: number;
}

export function copy({
  text,
  showToast = true,
  duration = 1500,
}: Params): Promise<void> {

  const textArea = document.createElement('textarea');
  textArea.value = text;

  textArea.style.top = '0px';
  textArea.style.left = '0px';
  textArea.style.position = 'fixed';
  textArea.style.padding = '0px';
  textArea.style.margin = '0px';
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  textArea.setSelectionRange(0, text.length);

  try {
    const successful = document.execCommand('copy');
    if (!successful) {
      throw new Error();
    }
    showToast && Toast.show({
      icon: 'success',
      content: '复制成功',
      duration
    });
  } catch (err) {
    showToast && Toast.show({
      icon: 'fail',
      content: '复制失败',
      duration
    });
  }

  document.body.removeChild(textArea);

  return Promise.resolve();
}
