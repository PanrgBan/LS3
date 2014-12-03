"use strict";

var
    gulp = require('gulp'),
    connect = require("gulp-connect"),
    rename = require('gulp-rename'),
    del = require('del'),
    plumber = require("gulp-plumber"),
    notify = require('gulp-notify'),
    opn = require('opn'),
    wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),

    pngquant = require('imagemin-pngquant'),
    imagemin = require('gulp-imagemin'),

    jshint = require('gulp-jshint'),
    uglify = require("gulp-uglify"),
    concat = require('gulp-concat'),

    jade = require("gulp-jade"),

    prefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    minCSS = require('gulp-minify-css');



//=================================
// Стартуем сервер. Порт: 8080

gulp.task('connect', function() {
    connect.server({
        root: '../public/',
        livereload: true
    });
    opn('http://localhost:8080/');
})


//=================================
// Компиляция SASS / Вендор-префиксы

gulp.task('css', function() {
    gulp.src('../source/sass/*.scss')
        .pipe(plumber({errorHandler: notify.onError("Error: CSS")}))
        .pipe(sass())
        .pipe(prefix({
            browsers: ['last 3 version', '> 1%', 'ie 8', 'ie 9', 'Opera 12.1'],
        }))
        .pipe(gulp.dest('../public/styles/'))
        .pipe(connect.reload())
        .pipe(notify("CSS compiled"));
});


//=================================
// Компиляция Jade

gulp.task('html', function() {
    gulp.src('../source/jade/*.jade')
        .pipe(plumber({errorHandler: notify.onError("Error: HTML")}))
        .pipe(jade({
            pretty: true
            }))
        .pipe(gulp.dest('../public/'))
        .pipe(notify("HTML compiled"))
        .pipe(connect.reload());
});


//=================================
// Конкатенация скриптов / JSHint

gulp.task('js', function() {
    gulp.src('../source/js/*.js')
        .pipe(plumber({errorHandler: notify.onError("Error: JS")}))
        .pipe(concat('app.js', {newLine: ';'}))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest('../public/scripts/'))
        .pipe(connect.reload())
        .pipe(notify("JS compiled"));
});


//=================================
// Минификация CSS

gulp.task('css:min', function() {
    gulp.src('../public/styles/style.css')
        .pipe(minCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('../public/styles/'))
});


//=================================
// Минификация JS

gulp.task('js:min', function() {
    gulp.src('../public/scripts/*.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('../public/scripts/'))
});


//=================================
// Оптимизация изображений

gulp.task('img:min', function() {
    gulp.src('../public/images/**/*.*')
        .pipe(plumber({errorHandler: notify.onError("Error: img min")}))
        .pipe(imagemin({
                    progressive: true,
                    svgoPlugins: [{removeViewBox: false}],
                    use: [pngquant()]
                }))
        .pipe(gulp.dest('../public/images/'))
});


//=================================
// Удаление файлов разработки

gulp.task('removeFiles', function() {
    del(['../public/styles/style.css',
         '../public/scripts/app.js'], {
        force: true
    });
});


//=================================
// Magic of wiredep

gulp.task('wiredep', function () {
  gulp.src('../public/*.html')
    .pipe(wiredep({
        directory: '../source/bower_components',
    }))
    .pipe(gulp.dest('../public/'))
    .pipe(connect.reload());
});


//=================================
// Magic of useref

gulp.task('useref', function () {
    var assets = useref.assets();

    return gulp.src('../public/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minCSS()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('../public/'));
});


//=================================
// Watch

gulp.task('watch', function() {
    gulp.watch('../source/jade/**/*.jade', ['html']);
    // gulp.watch('../public/*.html', ['wiredep'])

    gulp.watch('../source/sass/**/*.scss', ['css']);
    gulp.watch('../source/js/*.js', ['js']);
    gulp.watch('../source/images/**/*.*', ['img:min']);
    gulp.watch('bower.json', ['wiredep']);
});


//=================================
// Таски по группам


gulp.task('build', ['css:min', 'js:min', 'img:min'], function() {
    gulp.start('removeFiles');
    // gulp.start('wiredep');
    // gulp.start('useref');
});

gulp.task('start', ['html', 'css', 'js']);
gulp.task('default', ['connect', 'start', 'watch']);