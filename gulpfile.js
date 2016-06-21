var babel = require('rollup-plugin-babel');
var rollup = require('rollup').rollup;
var commonJs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');

gulp.task('css', function () {
    return gulp.src('./src/css/**/*.scss')
        .pipe(sass({
            outputStyle: gutil.env.production ? 'compressed' : 'nested'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {
    return rollup({
        entry: './src/js/main.js',
        plugins: [
            // nodeResolve({ jsnext: true }),
            // commonJs(),
            babel({
                exclude: 'node_modules/**'
            })
        ]
    }).then(function (bundle) {
        return bundle.write({
            format: 'iife',
            dest: './dist/js/main.js',
            sourceMap: !gutil.env.production
        }).then(function () {
            browserSync.reload();
        });
    });
});

gulp.task('serve', ['css', 'js'], function () {
    browserSync.init({
        server: './dist/'
    });

    gulp.watch('./src/css/**/*.scss', ['css']);
    gulp.watch('./src/js/**/*.js', ['js']);
    gulp.watch('./dist/**/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['css', 'js']);
