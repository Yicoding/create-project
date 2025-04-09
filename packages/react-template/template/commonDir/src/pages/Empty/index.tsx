import React from 'react';

import empty from '@/assets/images/empty.png';

import s from './styles.module.less';

const Empty = () => {

  return (
    <div className={s.root}>
      <div className={s.empty}>
        <img src={empty} alt="empty" />
        <p>诶呀，页面好像不存在哦~</p>
      </div>
    </div>
  );
};

export default Empty;
