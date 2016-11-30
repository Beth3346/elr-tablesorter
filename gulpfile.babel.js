import gulp from 'gulp';
import del from 'del';
import jshint from 'gulp-jshint';
import babel from 'gulp-babel';
import path from 'path';

gulp.task('clean:scripts', function() {
    return del([
        'dist/'
    ]);
});

gulp.task('jshint', function() {
    return gulp.src(['src/elr-tablesorter.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('babel', ['jshint'], function() {
    return gulp.src(['src/elr-tablesorter.js', 'elr-tablesorter.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(`dist`));
});

gulp.task('scripts', ['babel'], function() {
    return gulp.src(['dist/elr-tablesorter.js'])
        .pipe(gulp.dest(`dist`));
});

gulp.task('default', ['scripts']);