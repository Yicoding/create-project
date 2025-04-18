import React from 'react';

const prefixCls = '<%= projectName %>-button';

interface ButtonProps {
  children?: any;
}

const Button = ({ children }: ButtonProps) => {
  return (
    <button className={`${prefixCls}-root`}>{children}</button>
  );
};

export default Button;
