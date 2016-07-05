var gulp = require('gulp')
var webpack = require('gulp-webpack')
var livereload = require('gulp-livereload')

var paths = {
  scripts: ['src/**/*.js', 'src/**/*.jsx']
}

gulp.task('build', function () {
  return gulp.src('./main.js')
  .pipe(webpack(require('./webpack.config.js')))
  .pipe(gulp.dest('./'))
  .pipe(livereload())
})

gulp.task('watch', ['build'], function () {
  livereload.listen()
  gulp.watch(paths.scripts, ['build'])
})

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch'])
