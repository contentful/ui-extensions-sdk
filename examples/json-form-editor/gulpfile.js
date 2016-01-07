var gulp = require('gulp');
var merge = require('merge-stream');
var serve = require('gulp-serve');
var rename = require("gulp-rename");
var inlinesource = require('gulp-inline-source');

var files = [
  'src/*'
];
var dependencies = [
  '../../dist/*',
  'node_modules/json-editor/dist/jsoneditor.js'
];

gulp.task('default', ['copy'], function () {
  gulp.start('serve');
});

// Serve and watch for changes so we don't have to run `gulp` after each change.
gulp.task('watch', ['copy'], function () {
  gulp.start('serve');
  gulp.watch([files, dependencies], function () {
    gulp.start(['copy']);
  });
});

// Serve dist folder on port 3000 for local development.
gulp.task('serve', serve({
  root: 'dist'
}));

// Copy required dependencies into dist folder.
gulp.task('copy', function () {

  var filesStream = gulp.src(files)
    .pipe(gulp.dest('./dist'));

  var depsStream = gulp.src(dependencies)
    .pipe(gulp.dest('./dist/lib'));

  return merge(filesStream, depsStream);
});

// Bundles the whole widget into one file which can be uploaded to Contentful.
gulp.task('bundle', ['copy'], function () {
  gulp.src('./dist/index.html')
    .pipe(rename('index.min.html'))
    .pipe(inlinesource())
    .pipe(gulp.dest('./dist'));
});
