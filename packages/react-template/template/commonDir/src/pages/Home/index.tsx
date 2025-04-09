
import React from 'react';
import { useNavigate } from 'react-router-dom';

import s from './styles.module.less';

const Home = () => {
  const navigate = useNavigate();

  const handleClickLink = () => {
    navigate('/home/detail'); // 跳转路由
  };

  return (
    <div className={s.root}>
      <p>home页面</p>
      <div className={s.link} onClick={handleClickLink}>
        跳转到 home/detail页面
        <span />
      </div>
    </div>
  );
};

export default Home;
