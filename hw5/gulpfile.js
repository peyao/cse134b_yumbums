var gulp = require('gulp'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    sprity = require('sprity'),
    runSequence = require('run-sequence');

//run both tasks
gulp.task('default', function(){
    runSequence('minifyExternals', 'minifySrc');
});

//first bundle js, and css, and then minify them
gulp.task('minifyExternals', function() {
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist/src'));
});

//lastly minify html, needs to be separate from above task
gulp.task('minifySrc', function(){
    return gulp.src('dist/src/*.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('dist/src'));
});

gulp.task('sprites', function(){
    return sprity.src({
        src: 'img/*.{png,jpg}',
        style: 'sprite.css',
        margin: 0
  })
  .pipe(gulpif('*.png', gulp.dest('test'), gulp.dest('test'))) 
});