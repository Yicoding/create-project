import React, { FC } from 'react';
// CRA 默认支持 src/ 目录下的别名映射
import Example from 'components/Example';

const App: FC = () => {
  return (
    <>
      {/* 示例，编码时移除 */}
      <Example />
    </>
  );
};

export default App;
