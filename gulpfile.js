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
    clean = require('gulp-clean'),
    nodemon = require('gulp-nodemon');

var env = process.env.NODE_ENV || 'development';
    devBuildDir = 'app/builds/dev'
    srcFiles = {
      assetJS: ['src/js/*.js', 'src/js/**/*.js'],
      siteJS: ['src/js/*.js'],
      libsJS: ['src/js/libs/*.js'],
      views: ['src/views/**/*.jade'],
      lessFiles: ['src/less/*.less']
    }

gulp.task('jade', function(){
  return gulp.src(srcFiles.views)
          .pipe(jade())
          .pipe(gulp.dest(devBuildDir));
});

gulp.task('siteJS', function(){
  return gulp.src(srcFiles.siteJS)
          .pipe(jshint())
          .pipe(jshint.reporter(jshintStylish))
          .pipe(browserify())
          .pipe(concat('app.js'))
          .pipe(uglify())
          .pipe(gulp.dest(devBuildDir + '/js'));
});

gulp.task('libsJS', function(){
  return gulp.src(srcFiles.libsJS)
          .pipe(concat('lib.js'))
          .pipe(uglify())
          .pipe(gulp.dest(devBuildDir + '/js'));
});

gulp.task('clientJS', ['libsJS', 'siteJS']);

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

gulp.task('run-server', function(){
  nodemon({
    script: 'app/app.js'
  }, ['jade', 'css', 'clientJS']);
})

gulp.task('watch', function(){
  gulp.watch(srcFiles.assetJS, ['clientJS']);
})


gulp.task('dev-build', ['jade', 'css', 'clientJS', 'watch']);
gulp.task('default', ['dev-build', 'run-server']);
