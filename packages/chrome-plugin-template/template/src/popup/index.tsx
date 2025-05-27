import React, { useState } from 'react';

import s from './styles.module.less'

const Popup = () => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) {
      alert('请输入要发送的文字');
      return;
    }

    chrome.storage.local.set({ 'doubaoText': text }, () => {
      chrome.tabs.create({
        url: 'https://www.doubao.com/chat'
      });
    });
  };

  return (
    <div className={s.container}>
      <textarea
        className={s.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="请输入要发送的文字..."
      />
      <button className={s.button} onClick={handleSubmit}>发送到豆包</button>
    </div>
  );
};

export default Popup;