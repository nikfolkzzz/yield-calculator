const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const livereload = require('gulp-livereload');

function styles(){
  return gulp.src('app/scss/*.scss')
    .pipe(sass()).on('error',sass.logError)
    .pipe(autoprefixer({
            browsers: ['> 0.1%'],
            cascade: false
        }))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulp.dest('dest/css'))
    .pipe(browserSync.stream())
    // .pipe(livereload());
}

function html() {
    return gulp.src('app/*.html')
    .pipe(gulp.dest('dest/'))
    .pipe(browserSync.stream())

}

function fonts(){
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dest/fonts'))
}

function scripts() {
    return gulp.src('app/js/*.js')
    // .pipe(uglify({toplevel: true}))
    .pipe(gulp.dest('dest/js'))
    .pipe(browserSync.stream())
}

function watch() {
    gulp.watch('app/scss/*.scss', styles);
    gulp.watch('app/js/*.js', scripts);
    gulp.watch('app/*.html', html);
    gulp.watch('app/*.html').on('change', browserSync.reload);

}

function serve() {
    browserSync.init({
        server: {
            baseDir: './dest'
        },
    });
      browserSync.watch('dest',browserSync.reload)
}

function clean() {
    return del(['dest/*']);
}

gulp.task('serve', serve);
gulp.task('styles', styles);
gulp.task('html',html);
gulp.task('fonts',fonts);

gulp.task('scripts', scripts);
gulp.task('watch', watch );
gulp.task('seesome', gulp.parallel('watch','serve'));
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts ) ));
gulp.task('dev',gulp.series('build','watch' ))
gulp.task('default',gulp.series(gulp.parallel('scripts','styles'),gulp.parallel('watch','serve')));

//browser-sync start --server --files "css/*.css"
