const gulp = require('gulp');
const less = require('gulp-less');
const path = require('path');
const rename = require('gulp-rename');

// 定义源目录
const directories = ['es', 'lib'];

// 动态地为每个目录生成任务
directories.forEach((dir) => {
  const taskName = `less-${dir}`;

  // 定义任务函数
  gulp.task(taskName, () => {
    return gulp.src(`./${dir}/**/*.less`)
      .pipe(less({
        paths: [path.join(__dirname, 'less', 'includes')]
      }))
      .pipe(rename((filePath) => {
        // 保持目录结构,修改扩展名
        filePath.dirname = path.join(filePath.dirname);
        filePath.extname = '.css';
      }))
      .pipe(gulp.dest(`./${dir}`));  // 将生成的 CSS 文件放置在原始 LESS 文件同级目录中
  });
});

// 定义并行执行所有 less 任务的任务
gulp.task('less', gulp.parallel(directories.map(dir => `less-${dir}`)));

// 默认任务
gulp.task('default', gulp.series('less'));
