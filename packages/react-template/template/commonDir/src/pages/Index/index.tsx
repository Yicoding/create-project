import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { css } from '@emotion/react'
import clsx from 'clsx';
import { useBearStore, setState } from '@/store';
import type { BearState } from '@/store';
import { toggleTheme } from '@/utils/tools';

import s from './styles.module.less';

const color = 'red'

const boxStyle = css`
  color: ${color};
  font-size: 20px;
`;

const Index: FC = () => {
  const navigate = useNavigate();

  const { bears, increase, } = useBearStore((state: BearState) => state);

  const handleClickLink = () => {
    navigate('/home/detail'); // 跳转路由
  };

  return (
    <div className={s.root}>
      <p>index页面</p>
      <Link to="/home">
        <div className={s.link}>
          跳转到home页面
          <span />
        </div>
      </Link>
      <div className={clsx(s.link, s.linkLast)} onClick={handleClickLink}>
        跳转到 home/detail页面
        <span />
      </div>
      <div className={s.link}>
        store bears的值为: {bears}
        <button onClick={increase}>increase</button>
        <button onClick={() => setState({ bears: bears + 1 })}>setState</button>
      </div>
      <div className={s.link}>
        <div css={boxStyle}>@emotion/react样式</div>
      </div>
      <div className={s.link}>
        切换主题色：
        <button onClick={toggleTheme}>切换主题</button>
      </div>
    </div>
  );
};

export default Index;
