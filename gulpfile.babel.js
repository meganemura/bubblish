var babel    = require('gulp-babel');
var ghpages  = require('gh-pages');
var gulp     = require('gulp');
var notify   = require('gulp-notify');
var path     = require('path');
var pleeease = require('gulp-pleeease');
var plumber  = require('gulp-plumber');
var sass     = require('gulp-sass');
var server   = require('gulp-server-livereload');

gulp.task('sass', () => {
  gulp.src('./src/stylesheets/**/*.scss')
  .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
  .pipe(sass().on('error', sass.logError))
  .pipe(pleeease())
  .pipe(gulp.dest('./src/stylesheets'));
});

gulp.task('sass:watch', () => {
  gulp.watch('./src/stylesheets/**/*.scss', ['sass']);
});

gulp.task('babel', () => {
  gulp.src('./src/*.es6')
  .pipe(plumber({errorHandler: notify.onError("<%= error.message %>")}))
  .pipe(babel())
  .pipe(gulp.dest('./src'))
});

gulp.task('babel:watch', () => {
  gulp.watch('./src/*.es6', ['babel']);
});

gulp.task('watch', ['sass:watch', 'babel:watch']);

gulp.task('deploy', ['babel', 'sass'], () => {
  return ghpages.publish(path.join(__dirname, 'src'), function(err) {
    console.log(err);
  });
});

gulp.task('server', function() {
  gulp.src('.')
  .pipe(server({
    host: '0.0.0.0',
    livereload: true,
    open: true
  }));
});
