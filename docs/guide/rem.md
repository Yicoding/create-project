---
title: rem 适配
order: 5
toc: content
group:
  title: 移动端特有
  order: 4
nav:
  title: 指南
  order: 1
---

# rem 适配

## 设置rem

在 `index.html` 文件中

```html | pure
<script type="text/javascript">
  !(function (doc, win) {
    try {
      var docEl = doc.documentElement;
      resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize';
      var recalc = function () {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        docEl.style.fontSize = 10 * ((clientWidth >= 750 ? 750 : clientWidth) / 375) + 'px';
      };
      if (!doc.addEventListener) return;
      win.addEventListener(resizeEvt, recalc, false);
      doc.addEventListener('DOMContentLoaded', recalc, false);
    } catch (error) {
      console.log('计算rem error: ', error);
    }
  })(document, window);
</script>
```

## 使用rem

一般，设计稿会按照 `375px` 宽度来设计，那么在使用 `rem` 时，只需要将设计稿上的 `px值` 除以 `10` 即可。

```css | pure
.container {
  width: 10rem;
  height: 10rem;
  font-size: 1.2rem;
}
```