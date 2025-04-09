---
title: vconsole 调试
order: 6
toc: content
group:
  title: 移动端特有
  order: 4
nav:
  title: 指南
  order: 1
---

# vconsole 调试

## 设置 vconsole

在 `index.html` 文件中

```html | pure
<script type="text/javascript">
  !(function (doc) {
    try {
      var _log_debug = /_log_debug/.test(window.location.href);
      if (_log_debug) {
        var script = doc.createElement('script');
        script.type = 'text/javascript';
        script.src =
          '//unpkg.com/vconsole@3.15.1/dist/vconsole.min.js';
        doc.body.appendChild(script);
        script.onload = function () {
          var vConsole = new window.VConsole();
        };
      }
    } catch (error) {
      console.error(error);
    }
  })(document);
</script>
```

## 开启 vconsole

访问页面时，在地址栏中添加 `_log_debug` 参数即可开启 vconsole