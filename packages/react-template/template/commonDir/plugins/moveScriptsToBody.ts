// 自定义插件，将脚本从head移动到body底部
import type { Plugin } from 'vite';

export function moveScriptsToBody(): Plugin {
  return {
    name: 'move-scripts-to-body',
    enforce: 'post',
    transformIndexHtml: {
      enforce: 'post',
      order: 'post',
      handler(html: string): string {
        // 提取HTML基本结构
        const docTypeMatch = html.match(/^<!DOCTYPE[^>]*>/i);
        const htmlStartMatch = html.match(/<html[^>]*>/i);
        const htmlEndMatch = html.match(/<\/html>/i);
        const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

        if (!docTypeMatch || !htmlStartMatch || !htmlEndMatch || !headMatch || !bodyMatch) {
          return html;
        }

        // 提取基本结构元素
        const docType = docTypeMatch[0];
        const htmlStart = htmlStartMatch[0];
        const htmlEnd = htmlEndMatch[0];
        const bodyTag = bodyMatch[0].match(/<body[^>]*>/i)[0];

        // 提取并处理内容
        let headContent = headMatch[1];
        let bodyContent = bodyMatch[1];

        // 收集脚本
        const scripts = {
          module: [] as string[],
          nomodule: [] as string[],
          normal: [] as string[]
        };

        // 从modulepreload链接创建脚本
        const createScriptFromModulepreload = (match: string) => {
          const href = match.match(/href=["']([^"']+)["']/);
          return href ? `<script type="module" src="${href[1]}"></script>` : '';
        };

        // 提取并分类脚本的函数
        const extractScripts = (content: string, fromBody = false) => {
          // 处理modulepreload链接
          content = content.replace(/<link\s+rel=["']modulepreload["'][^>]*?>/gi, match => {
            const script = createScriptFromModulepreload(match);
            if (script) scripts.module.push(script);
            return '';
          });

          // 处理所有脚本标签
          content = content.replace(/<script([^>]*?)>([\s\S]*?)<\/script>/gi, (match, attrs, content) => {
            // 对于body中的普通脚本，保留在原位置
            if (attrs.includes('nomodule')) {
              scripts.nomodule.push(`<script${attrs}>${content}</script>`);
              return '';
            } else if (attrs.includes('type="module"')) {
              scripts.module.push(`<script${attrs}>${content}</script>`);
              return '';
            } else if (fromBody) {
              scripts.normal.push(`<script${attrs}>${content}</script>`);
              return '';
            }
            return match; // 保留head中的其他脚本
          });

          // 移除注释
          return content.replace(/<!--[\s\S]*?-->/g, '').replace(/\n\s*\n/g, '\n').trim();
        };

        // 处理head和body内容
        headContent = extractScripts(headContent);
        bodyContent = extractScripts(bodyContent, true);

        // 构建最终的HTML
        const finalHtml =
          docType + htmlStart +
          '<head>' + headContent + '</head>' +
          bodyTag + bodyContent +
          scripts.normal.join('') +
          scripts.module.join('') +
          scripts.nomodule.join('') +
          '</body>' + htmlEnd;

        // 删除多余空行并返回
        return finalHtml.replace(/\n\s*\n/g, '\n');
      }
    }
  };
} 