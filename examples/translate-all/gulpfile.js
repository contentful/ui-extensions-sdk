var gulp = require('gulp')
var del = require('del')
var merge = require('utils-merge')
var serve = require('gulp-serve')
var rename = require('gulp-rename')
var sourcemaps = require('gulp-sourcemaps')
var inlinesource = require('gulp-inline-source')
var duration = require('gulp-duration')
var bundleTimer = duration('Javascript bundle time')
var plumber = require('gulp-plumber')
var stylus = require('gulp-stylus')
var babelify = require('babelify')
var watchify = require('watchify')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')

var config = {
  src: './src/',
  mainJs: './index.js',
  mainHtml: './index.html',
  buildDir: './dist/',
  dependencies: [
    '../../dist/*.*',
    // TODO: Sort out do-translate's issue with browserify.
    './node_modules/do-translate/browser/do-translate.min.js'
  ]
}

gulp.task('default', ['build'], function () {
  gulp.start('serve')
})

// Serve dist folder on port 3000 for local development.
gulp.task('serve', serve({
  root: 'dist'
}))

// Serve and watch for changes so we don't have to run `gulp` after each change.
gulp.task('watch', ['serve', 'stylus', 'copy-html', 'copy-deps'], function () {
  gulp.watch('./src/index.html', ['copy-html'])
  gulp.watch(config.dependencies, ['copy-deps'])

  var bundler = watchifyBundler(newBundler(watchify.args))
  bundler.on('update', bundle.bind(null, bundler))

  return bundle(bundler)
})

gulp.task('build', ['stylus', 'copy-html', 'copy-deps'], function () {
  return bundle(newBundler())
})

gulp.task('copy-html', function () {
  return gulp.src(config.src + config.mainHtml)
    .pipe(gulp.dest(config.buildDir))
})

gulp.task('copy-deps', function () {
  return gulp.src(config.dependencies)
    .pipe(gulp.dest(config.buildDir + 'lib'))
})

gulp.task('stylus', function () {
  return gulp.src(config.src + '*.styl')
    .pipe(plumber({
      errorHandler: function (err) {
        console.log(err)
        this.emit('end')
      }
    }))
    .pipe(stylus())
    .pipe(plumber.stop())
    .pipe(gulp.dest(config.buildDir))
})

// Bundles the whole widget into one file which can be uploaded to Contentful.
gulp.task('bundle', ['build'], function () {
  return gulp.src(config.buildDir + config.mainHtml)
    .pipe(rename('index.min.html'))
    .pipe(inlinesource())
    .pipe(gulp.dest('./dist'))
})

gulp.task('clean', function () {
  return del([
    './dist'
  ])
})

function bundle (bundler) {
  return bundler.bundle()
    .pipe(source(config.mainJs))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.buildDir))
    .pipe(bundleTimer)
}

function newBundler (args) {
  args = merge({
    debug: true,
    basedir: config.src
  }, args || {})

  return browserify(config.mainJs, args)
    .transform(babelify, {
      presets: ['es2015']
    })
}

function watchifyBundler (bundler) {
  return bundler.plugin(watchify, {
    ignoreWatch: ['**/node_modules/**']
  })
}
