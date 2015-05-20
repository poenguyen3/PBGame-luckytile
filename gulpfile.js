var gulp = require('gulp'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    csslint = require('gulp-csslint'),
    jshint = require('gulp-jshint'),
    jshintStylish = require('jshint-stylish'),
    autoprefix = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    uglifyCss = require('gulp-uglifycss'),
    gulpif = require('gulp-if')
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean');

var env = process.env.NODE_ENV || 'development';
    devBuildDir = 'builds/dev'
    srcFiles = {
      clientJS: ['src/js/*.js', 'src/js/**/*.js'],
      views: ['src/views/**/*.jade'],
      lessFiles: ['src/less/*.less']
    }

gulp.task('jade', function(){
  return gulp.src(srcFiles.views)
          .pipe(jade())
          .pipe(gulp.dest(devBuildDir));
});

gulp.task('clientJS', function(){
  return gulp.src(srcFiles.clientJS)
          .pipe(jshint())
          .pipe(jshint.reporter(jshintStylish))
          .pipe(browserify())
          .pipe(concat('app.js'))
          .pipe(uglify())
          .pipe(gulp.dest(devBuildDir + '/js'));
});

gulp.task('css', function(){
  return gulp.src(srcFiles.lessFiles)
          .pipe(less())
          .pipe(concat('style.css'))
          .pipe(csslint())
          .pipe(csslint.reporter())
          .pipe(autoprefix())
          .pipe(gulpif(env === 'production', uglifyCss()))
          .pipe(gulp.dest(devBuildDir + '/css'));
});

gulp.task('clean-dev', function(){
  return gulp.src(devBuildDir, {read: false})
          .pipe(clean());
})


gulp.task('dev-build', ['jade', 'css', 'clientJS']);
gulp.task('default', ['dev-build']);
