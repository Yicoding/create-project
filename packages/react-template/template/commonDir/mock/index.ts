/**
 * 使用Vite的import.meta.glob API
 * 注意：
 * 1. 在TypeScript中，import.meta.glob在运行时可用，但在类型检查时会被识别为不存在
 * 2. 因此，需要使用类型断言来处理
 */
// 使用Vite提供的import.meta.glob API
interface ViteImportMeta extends ImportMeta {
  glob: (pattern: string) => Record<string, () => Promise<any>>;
}

// 使用类型检查和断言
const isViteMeta = (meta: any): meta is ViteImportMeta =>
  typeof meta.glob === 'function';

// 使用类型断言处理导入
const viteImportMeta = isViteMeta(import.meta) ? import.meta : null;
const globModules = viteImportMeta
  ? (viteImportMeta as ViteImportMeta).glob('./**/*.ts')
  : {};

const modules = Object.values(globModules);

export default modules;

