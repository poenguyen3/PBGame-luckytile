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
      nodeServer: ['app/app.js'],
      views: ['src/views/**/*.jade', 'src/views/*.jade'],
      lessFiles: ['src/less/*.less'],
      cssLibs: ['src/css/*.css'],
      fontFiles: [
        'src/fonts/**/*.woff',
        'src/fonts/**/*.ttf',
        'src/fonts/**/*.woff2',
        'src/fonts/**/*.eot',
        'src/fonts/*.woff',
        'src/fonts/*.ttf',
        'src/fonts/*.eot',
        'src/fonts/*.woff2'
      ]
    }

gulp.task('jadeView', function(){
  return gulp.src(srcFiles.views)
          .pipe(jade())
          .pipe(gulp.dest(devBuildDir));
});

gulp.task('siteJS', function(){
  return gulp.src(srcFiles.siteJS)
          .pipe(jshint())
          .pipe(jshint.reporter(jshintStylish))
          // .pipe(browserify())
          .pipe(concat('app.js'))
          .pipe(uglify())
          .pipe(gulp.dest(devBuildDir + '/js'));
});

gulp.task('libsJS', function(){
  return gulp.src(srcFiles.libsJS)
          .pipe(concat('lib.js'))
          // .pipe(browserify())
          .pipe(uglify())
          .pipe(gulp.dest(devBuildDir + '/js'));
});

gulp.task('clientJS', ['libsJS', 'siteJS']);

gulp.task('less', function(){
  return gulp.src(srcFiles.lessFiles)
          .pipe(less())
          .pipe(concat('style.css'))
          .pipe(csslint())
          .pipe(csslint.reporter())
          .pipe(autoprefix())
          .pipe(gulpif(env === 'production', uglifyCss()))
          .pipe(gulp.dest(devBuildDir + '/css'));
});

gulp.task('cssLib', function(){
  return gulp.src(srcFiles.cssLibs)
          .pipe(concat('libs.css'))
          .pipe(gulp.dest(devBuildDir + '/css'));
});

gulp.task('css', ['less', 'cssLib']);

gulp.task('font', function(){
  return gulp.src(srcFiles.fontFiles)
          .pipe(gulp.dest(devBuildDir + '/font'));
})

gulp.task('asset', ['font']);

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
  gulp.watch(srcFiles.lessFiles, ['less']);
  gulp.watch(srcFiles.views, ['jadeView']);
});



gulp.task('dev-build', ['clean-dev', 'jadeView', 'css', 'clientJS', 'asset', 'watch']);
gulp.task('default', ['dev-build', 'run-server']);
