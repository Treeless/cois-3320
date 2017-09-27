(function() {
  const DEBUG = process.env.NODE_ENV === 'debug';

  var gulp = require('gulp'),
    mocha = require('gulp-spawn-mocha'),
    gutil = require('gulp-util');

  gulp.task('unit', [], function() {
    var self = this;
    gulp.src(['tests/**/*.spec.js'], { read: false })
      .pipe(mocha({
        "debugBrk": DEBUG,
        'r': "tests/setup.js",
        "R": 'spec',
      })).on("error", function(err) {
        self.emit('done');
      })
  });

  gulp.task('watch-js', function() {
    gulp.watch(["./*.js", "tests/**/*.spec.js"], ['unit']);
  });

  gulp.task("default", ['watch-js', "unit"]);
}());