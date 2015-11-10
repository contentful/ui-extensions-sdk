var gulp = require('gulp');
var inlinesource = require('gulp-inline-source');
 
gulp.task('default', function () {
  return gulp.src('*.html')
    .pipe(inlinesource())
    .pipe(gulp.dest('./dist'));
});