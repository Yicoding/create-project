import { defineConfig } from 'dumi';

const logo =
  'https://imagev2.xmcdn.com/storages/f8d2-audiofreehighqps/81/43/GMCoOSYIO18uAAAvaAIdYbXD.png';

/**
 * 需要根据仓库地址自行修改publicPath
 * 例如：
 * gitlab仓库地址为：https://gitlab.com/react-library/template/dumi2-docs
 * 那么publicPath应该设置为 /template/dumi2-docs
 */
const publicPath =
  process.env.NODE_ENV === 'production' ? `/` : '/';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: '文档标题',
    logo,
  },
  history: {
    type: 'hash',
  },
  hash: true,
  favicons: [logo],
  publicPath,
  alias: {
    images: '/docs/images',
  },
});
