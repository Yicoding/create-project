---
title: CSS 编写
order: 8
toc: content
group:
  title: 基础
  order: 3
nav:
  title: 指南
  order: 1
---

# CSS 编写

## 推荐写法

- 静态样式使用 `css module` 编写（基于 `less`）
- 动态样式使用 [@emotion/react](https://www.npmjs.com/package/@emotion/react) 编写
- 组件样式使用 `BEM规范` 或 `统一给所有选择器名添加前缀` 等

## 示例

### 静态样式编写

使用 `css module` 编写样式（基于 `less`）

- 编写 `styles.module.less` 文件

```less | pure
.root {
  font-size: 17px;
  .header {
    background-color: #fff;
  }
  .contentBox {
    color: #000;
  }
}
```

- 使用

```tsx | pure
import s from './styles.module.less';

<div className={s.root}>
  <div className={s.header}>Header</div>
  <div className={s.contentBox}>Content</div>
</div>
```

### 动态样式编写

如果需要动态修改样式，使用 [@emotion/react](https://www.npmjs.com/package/@emotion/react) 来进行编写

```tsx | pure
import React from 'react';
import { css } from '@emotion/react';

type Props = {
  color: string;
};

const Home: FC<Props> = ({ color }) => {

  const boxStyle = css`
    color: ${color};
    font-size: 20px;
  `;

  return (
    <div>
      <div css={boxStyle}>@emotion/react样式</div>
      <div
        css={
          css`
            color: ${color};
            font-size: 20px;
          `
        }
      >
        @emotion/react样式
      </div>
    </div>
  );
}

export default Home;
```

### 组件样式编写

推荐使用 BEM 规范或统一给所有选择器名添加前缀等

- 编写 `styles.less` 文件

```less
@prefix-cls: ~'header';

.@{prefix-cls}-root {
  height: 52px;
  .@{prefix-cls}-main {
    color: #131313;
    .@{prefix-cls}-logo {
      width: 22px;
    }
  }
  .@{prefix-cls}-btn {
    color: #f44;
  }
}
```

- 在 `index.tsx` 文件中使用

```tsx | pure
import './styles.less';

const prefixCls = 'header';

<div className={`${prefixCls}-root`}>
  <div className={`${prefixCls}-main`}>
    <img className={`${prefixCls}-logo`} />
  </div>
  <div className={`${prefixCls}-btn`}>按钮</div>
</div>
```

## 为什么使用 @emotion/react 编写动态样式 ？

### 内联样式 (Inline Styles)

在 React 中，内联样式是一种直接在元素上定义 CSS 样式的方式，类似于在 HTML 中使用 style 属性。不同的是，在 React 中，内联样式是通过一个 JavaScript 对象来定义的，而不是传统的 CSS 字符串。这使得内联样式在 React 中具有更强的动态性和灵活性。

<b>基本用法</b>

在 React 中，内联样式通过元素的 style 属性来设置，该属性接受一个 JavaScript 对象。对象的键是 CSS 属性名（使用驼峰命名法），值是对应的样式值；如下：

```jsx | pure
import React, { useState } from 'react';

function DynamicStyles() {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  const divStyle = {
    color: isActive ? 'red' : 'blue',
    backgroundColor: 'lightgray',
    padding: '10px',
    cursor: 'pointer',
    userSelect: 'none',
  };

  return (
    <div style={divStyle} onClick={handleClick}>
      Click me to change color!
    </div>
  );
}

export default DynamicStyles;
```

<b>优点:</b>

- 局部作用域：内联样式只作用于当前的元素，不会影响其他元素，避免了样式冲突。
- 动态性：可以很方便地根据组件的状态或属性来动态设置样式。

<b>缺点:</b>

- 可维护性：当样式变得复杂时，内联样式会使得组件代码变得难以维护。
- 复用性差：内联样式无法复用，相同的样式需要在多个地方重复定义。
- 缺少伪类和伪元素支持：内联样式无法直接使用 CSS 伪类和伪元素（如 :hover, ::after）。
- 性能差：联样式对象包含大量的属性或者嵌套的对象，这可能会使得样式对象的创建和合并更加耗时。
- 可编写性：跟常规CSS写法相比，所有属性都要使用驼峰命名法，书写起来比较繁琐，迁移到CSS时成本较高。

### Styled Components

[Styled Components](https://www.npmjs.com/package/styled-components) 是一个流行的 CSS-in-JS 库，它使用 ES6 的模板字符串语法来定义组件级别的样式。通过使用 Styled Components，你可以将组件的样式与其逻辑紧密结合，使得样式更加模块化和可维护。

<b>基本用法</b>

```jsx | pure
import { useState } from 'react';
import styled from 'styled-components';

// 定义一个带有样式的容器组件
const Container = styled.div`
  /* 根据 props.isActive 设置颜色 */
  color: ${props => (props.isActive ? 'red' : 'blue')};
  background-color: lightgray;
  padding: 10px;
  cursor: pointer;
  transition: color 0.3s;
`;

const Button = styled.button`
  /* 根据 props.primary 设置按钮样式 */
  background: ${props => (props.$primary ? '#BF4F74' : 'white')};
  color: ${props => (props.$primary ? 'white' : '#BF4F74')};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #bf4f74;
  border-radius: 3px;
`;

function Home() {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <main>
      <Container isActive={isActive}>Click me to change color!</Container>
      <Button onClick={handleClick} $primary={isActive}>
        Primary
      </Button>
    </main>
  );
}

export default Home;
```

<b>优点</b>

- 模块化：每个组件的样式都与组件本身紧密结合，避免了样式冲突。
- 动态样式：可以方便地根据组件的状态或属性来动态调整样式。
- 可维护性：将组件的样式和逻辑放在一起，使得代码更加内聚和可维护。

<b>缺点</b>

- 性能：在某些情况下，CSS-in-JS 可能会对性能产生影响，因为样式是在运行时生成的。
- 可读性：标签和其他DOM元素混杂在一起，使得代码可读性较差。

