var gulp = require('gulp'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    runSequence = require('run-sequence');

gulp.task('default', function(){
    runSequence('minifyExternals', 'minifySrc');
});

gulp.task('minifyExternals', function() {
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist/src'));
});

gulp.task('minifySrc', function(){
    return gulp.src('dist/src/*.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('dist/src'));
});