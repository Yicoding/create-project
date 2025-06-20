// eg: react css modules（暂不支持使用 @ 别名导入）
import style from './style.module.less';
import React, { FC } from 'react';

const Code: FC = () => {
  return (
    // use styleName
    <code styleName="code-wrapper">
      <span className={style['code-wrapper']}>
        yarn create react-app my-app --template @xx/cra-template-typescript
      </span>
      --registry http://xnpm.xxxx.com
    </code>
  );
};

export default Code;
