// 上传sourcmap脚本
const { execSync } = require('child_process');

const pck = require(process.cwd() + '/package.json')

const release = pck.version || 'last';

// 上传 Source Map 文件，并指定自动生成的版本号
// xmkp-parent-center： 项目名称
// xmly：组织名称（固定）
// './dist/h5/js/*.js.map'：匹配相对于根路径下的产物的map文件
// ~/yx/xmkp-parent-center/last/build/static/js： sentry 服务 的 线上js访问地址（固定写法）,xmkp-parent-center项目名
//${release}： 动态版本号

try {
  const deletCommand = `sentry-cli releases files ${release} delete --all`
  execSync(deletCommand);
  console.log(`Source Map files delete successfully for release: ${release}`);
} catch (error) {
  console.error('Error delete Source Map files:', error.message);
}
// 上传 Source Map 文件，并指定自动生成的版本号
try {
  const command = `sentry-cli releases -o xmly -p ${pck.name} files upload-sourcemaps './dist/assets/*.js.map' --url-prefix '~/yx/${pck.name}/last/dist/assets' --release ${release}`;
  execSync(command);
  console.log(`Source Map files uploaded successfully for release: ${release}`);
} catch (error) {
  console.error('Error uploading Source Map files:', error.message);
}

