import { FC } from 'react';

import EmptyImg from '@/assets/images/empty.png';

import s from './styles.module.less';

type Props = {
  text?: string;
}

const Index: FC<Props> = ({ text }) => {
  return (
    <div className={s.root}>
      <img src={EmptyImg} alt="empty" className={s.emptyIcon} />
      <span className={s.emptyText}>{text || '诶呀，数据好像不存在哦~'}</span>
    </div>
  );
};

export default Index;
