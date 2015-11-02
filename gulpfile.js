'use strict';

var gulp        = require('gulp');
var jscs        = require('gulp-jscs');
var jshint      = require('gulp-jshint');
var mdBlock     = require('gulp-markdown-code-blocks');
var mocha       = require('gulp-spawn-mocha');
var runSequence = require('run-sequence');

var CI = process.env.CI === 'true';
var DEBUG = process.env.DEBUG === 'true';

gulp.task('default', function (done) {
  runSequence('lint', 'test', done);
});

gulp.task('test', function (done) {
  runSequence('test-unit', 'test-integration', done);
});

gulp.task('lint', function (done) {
  runSequence('lint-code', 'lint-readme', done);
});

gulp.task('lint-code', function () {
  return gulp
    .src([
      './gulpfile.js',
      './index.js',
      './bin/**/*',
      './lib/**/*.js',
      './test/**/*.js'
    ])
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('lint-readme', function () {
  return gulp
    .src('./README.md')
    .pipe(mdBlock());
});

gulp.task('test-unit', function () {
  return gulp
    .src('./test/unit/**/*-test.js', { read: false })
    .pipe(mocha({
      debugBrk: DEBUG,
      reporter: CI ? 'dot' : 'spec'
    }));
});

gulp.task('test-integration', function () {
  return gulp
    .src('./test/integration/**/*-test.js', { read: false })
    .pipe(mocha({
      debugBrk: DEBUG,
      reporter: CI ? 'dot' : 'spec'
    }));
});
