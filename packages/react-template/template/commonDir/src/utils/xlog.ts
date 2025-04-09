import { ubt } from '@xmly/xmrep';

const xmRequestId = Math.random().toString().slice(-8);

// 常规埋点
const xLog = {
  homePageShow: () => {
    ubt.pageView(0, 'xxx', {
      currPage: 'xxx',
      xmRequestId
    });
  },
};

// 控件曝光（出现在视口内）
export const trackerMap = {
  // 埋点id
  'xxx': () => {
    ubt.event(0, 'slipPage', {
      currPage: 'xxx',
      xmRequestId
      // ...其他埋点信息
    });
  },
};

export default xLog;
