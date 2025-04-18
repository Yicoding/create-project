const gulp = require('gulp');
const less = require('gulp-less');
const path = require('path');
const rename = require('gulp-rename');
const fs = require('fs');

// 处理目录列表
const dirs = ['es', 'lib'];

// 1. 编译Less文件为CSS
dirs.forEach(dir => {
  gulp.task(`less-${dir}`, () =>
    gulp.src(`./${dir}/**/*.less`)
      .pipe(less({ paths: [path.join(__dirname, 'less', 'includes')] })
        .on('error', function (err) {
          console.error(`Less Error: ${err.fileName} - ${err.message}`);
          this.emit('end');
        })
      )
      .pipe(rename(p => { p.extname = '.css'; }))
      .pipe(gulp.dest(`./${dir}`))
  );
});

// 2. 修复JS文件中的.less引用
gulp.task('fix-imports', (done) => {
  // 递归处理目录
  function processDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        processDir(fullPath);
      }
      else if (file.endsWith('.js')) {
        // 处理JS文件
        let content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('.less')) {
          content = content.replace(/\.less/g, '.css');
          fs.writeFileSync(fullPath, content, 'utf8');
        }
      }
    }
  }

  // 处理lib和es目录
  dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      processDir(dir);
    }
  });

  done();
});

// 3. 组合任务
gulp.task('less', gulp.parallel(dirs.map(dir => `less-${dir}`)));
gulp.task('default', gulp.series('less', 'fix-imports'));
