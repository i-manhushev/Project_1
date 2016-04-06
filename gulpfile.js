"use strict";
const config = require('./gulpconfig.js');
const gulp = require('gulp');

//css
const less = require('gulp-less');

//js
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

//server
const connect = require('gulp-connect');

//browser
const open = require('gulp-open');
const browserSync = require('browser-sync').create();




// css task
gulp.task('css',() => {
    return gulp.src(config.paths.stylesheets)
        .pipe(less())
        .pipe(gulp.dest(config.paths.build + '/css'))
});

// html task
gulp.task('html',() => {
    return gulp.src(config.paths.index)
        .pipe(gulp.dest(config.paths.build))
});

// js task (es6 -> es5 + modules)
gulp.task('js', () => {
    return browserify({
        entries: config.paths.app,
        debug: true
    })
          .transform('babelify',({presets:["es2015"]}))
          .bundle()
          .pipe(source('app.js'))
          .pipe(gulp.dest(config.paths.build + '/js'));
});

// server
gulp.task('server', () =>{
    connect.server({
        root: config.paths.build,
        port: config.port,
    });
});

/**
// browser
 if we dont use browsersync (task 'serve'), we can just open browser
gulp.task('browser',['server'], ()=> {
       
    return gulp
    .src(config.paths.build)
    .pipe(open({uri: 'http://localhost:' + config.port , app: config.browser}));
});
**/

// gulp serve task  - to start browser synchronization
gulp.task('serve', ['server'], () => {
    browserSync.init(null, config.browserSync);
})



//watchers
gulp.task('watch', () => {
    gulp.watch(config.paths.stylesheets, ['css']);
    gulp.watch(config.paths.index, ['html']);
    gulp.watch(config.paths.js, ['js']);
});

gulp.task('default', ['css','js','html','serve', 'watch']);
