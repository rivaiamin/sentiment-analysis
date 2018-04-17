"use strict";

// web less

var gulp = require('gulp');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
//var imagemin = require('gulp-imagemin');
var cssmin = require('gulp-cssmin');
//var stylus = require('gulp-stylus');
//var fontmin = require('fontmin');
var concat = require('gulp-concat');

//front-end
var paths = {
    libjs: [
      //jquery
      'bower_components/jquery/dist/jquery.min.js',

      //semantic
      'bower_components/semantic/dist/semantic.min.js',
      //jquery
      'bower_components/chart.js/dist/Chart.min.js',
      'bower_components/trumbowyg/dist/trumbowyg.min.js',
      'bower_components/trumbowyg/dist/langs/id.min.js',

      //angular
      'bower_components/angular/angular.min.js',
      'bower_components/angular-cookies/angular-cookies.min.js',
      'bower_components/angular-sanitize/angular-sanitize.min.js',
      'bower_components/angular-resource/angular-resource.min.js',
      'bower_components/angular-ui-router/release/angular-ui-router.min.js',
      'bower_components/satellizer/dist/satellizer.min.js',
      'bower_components/angular-xeditable/dist/js/xeditable.min.js',
      'bower_components/ng-file-upload/ng-file-upload.min.js',
      'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
      'bower_components/ng-tags-input/ng-tags-input.min.js',
      'bower_components/angular-ui-notification/dist/angular-ui-notification.min.js',
      'bower_components/moment/min/moment.min.js',
      'bower_components/angular-chart.js/dist/angular-chart.js',
      'bower_components/ngmap/build/scripts/ng-map.min.js'
	],
	js:[
		'public/js/frontend/controllers/*.js',
		'public/js/frontend/kg.config.js',
		'public/js/frontend/kg.app.js',
		'public/js/frontend/kg.custom.js',
	],
	css: [

        //semantic-ui
        'bower_components/semantic/dist/semantic.min.css',
        'bower_components/trumbowyg/dist/ui/trumbowyg.min.css',
        /*'bower_components/semantic/dist/components/site.min.css',
        'bower_components/semantic/dist/components/reset.min.css',

        'bower_components/semantic/dist/components/button.min.css',
        'bower_components/semantic/dist/components/container.min.css',
        'bower_components/semantic/dist/components/checkbox.min.css',
        'bower_components/semantic/dist/components/header.min.css',
        'bower_components/semantic/dist/components/image.min.css',
        'bower_components/semantic/dist/components/loader.min.css',
        'bower_components/semantic/dist/components/label.min.css',
        'bower_components/semantic/dist/components/input.min.css',
        'bower_components/semantic/dist/components/item.min.css',
        'bower_components/semantic/dist/components/list.min.css',
        'bower_components/semantic/dist/components/divider.min.css',
        'bower_components/semantic/dist/components/statistic.min.css',
        'bower_components/semantic/dist/components/segment.min.css',
        'bower_components/semantic/dist/components/icon.min.css',

        'bower_components/semantic/dist/components/form.min.css',
        'bower_components/semantic/dist/components/grid.min.css',
        'bower_components/semantic/dist/components/menu.min.css',
        'bower_components/semantic/dist/components/table.min.css',

        'bower_components/semantic/dist/components/card.min.css',

        'bower_components/semantic/dist/components/accordion.min.css',
        'bower_components/semantic/dist/components/modal.min.css',
        'bower_components/semantic/dist/components/dropdown.min.css',
        'bower_components/semantic/dist/components/sidebar.min.css',
        'bower_components/semantic/dist/components/progress.min.css',
        'bower_components/semantic/dist/components/tab.min.css',
        'bower_components/semantic/dist/components/transition.min.css',*/

        //jquery
        //'bower_components/circliful/css/material-design-iconic-font.min.css',

        'bower_components/angular-ui-notification/dist/angular-ui-notification.min.css',

        //angular
        'bower_components/ng-tags-input/ng-tags-input.min.css',
        'bower_components/angular-xeditable/dist/css/xeditable.min.css',

        'assets/fonts/icons.css',

        'assets/css/backend.css',
        //'public/assets/css/styles.css',
    ],
};

gulp.task('libjsmin', function() {
  return gulp.src(paths.libjs)
    .pipe(uglify())
    .pipe(concat('lib.min.js'))
    .pipe(gulp.dest('assets/js'));
});

gulp.task('jsmin', function() {
  return gulp.src(paths.js)
    .pipe(uglify())
    .pipe(concat('kg.min.js'))
    .pipe(gulp.dest('assets/js'));
});

gulp.task('cssmin', function () {
    return gulp.src(paths.css)
        .pipe(cssmin({processImport: false}))
        .pipe(concat('veripay.min.css'))
        .pipe(gulp.dest('assets/css'));
});

gulp.task('watch', function() {
  gulp.watch(paths.js, ['jsmin']);
  gulp.watch(paths.css, ['cssmin']);
});

gulp.task('default', ['watch', 'libjsmin', 'jsmin', 'cssmin']);
