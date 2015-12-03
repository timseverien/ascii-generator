var DIR_ASSETS = 'assets',
    DIR_ASSETS_SCRIPTS = DIR_ASSETS + '/scripts',
    DIR_ASSETS_STYLES = DIR_ASSETS + '/styles',

    DIR_SRC = 'src',
    DIR_SRC_SCRIPTS = DIR_SRC + '/scripts',
    DIR_SRC_STYLES = DIR_SRC + '/styles'

    fs = require('fs'),
    path = require('path'),

    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),

    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),

    babel = require('gulp-babel'),
    browserify = require('browserify'),
    concat = require('gulp-concat'),
    iife = require('gulp-iife'),
    uglify = require('gulp-uglify'),

    autoprefix = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin'),
    sass = require('gulp-sass'),

    OPTIONS_BABELIFY = {
        presets: ['es2015']
    },

    OPTIONS_IIFE = {
        params: ['window', 'document'],
        args: ['window', 'document', 'undefined']
    },

    sources = {
        scripts: [
            {
                source: DIR_SRC_SCRIPTS + '/workers/AsciiFactory.js',
                destination: DIR_ASSETS_SCRIPTS + '/ascii-factory.js'
            }, {
                source: [DIR_SRC_SCRIPTS + '/App.js'],
                destination: DIR_ASSETS_SCRIPTS + '/scripts.js'
            }, {
                source: [DIR_SRC_SCRIPTS + '/ToggleButton.js'],
                destination: DIR_ASSETS_SCRIPTS + '/toggle-button.js'
            }
        ],
        styles: DIR_SRC_STYLES + '/**/*.scss'
    };

gulp.task('default', ['scripts', 'styles']);

gulp.task('scripts', function() {
    sources.scripts.map(function(script) {
        return browserify(script.source)
            .transform('babelify', OPTIONS_BABELIFY)
            .bundle()
            .pipe(source(path.basename(script.destination)))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(path.dirname(script.destination)));
    });
});

gulp.task('styles', function() {
    return gulp.src(sources.styles)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())
        .pipe(cssmin())
        .pipe(autoprefix())
        .pipe(plumber.stop())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('assets/styles'));
});

gulp.task('watch', ['default'], function() {
    gulp.watch(DIR_SRC_SCRIPTS + '/**/*.js', ['scripts'])
    gulp.watch(sources.styles, ['styles'])
});
