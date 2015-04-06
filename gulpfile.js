/*global require */

var gulp = require('gulp'),
	eslint = require('gulp-eslint'),
	//karma = require('karma').server,
	karma = require('gulp-karma'),
	//jasmine = require('gulp-jasmine-phantom'),
	concat = require('gulp-concat'),
	stripDebug = require('gulp-strip-debug'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify'),
	uglify = require('gulp-uglify');

gulp.task('lint', function () {
	return gulp.src(['./app/*.js'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('test', ['lint'], function (done) {
	return gulp.src(['./test/obj-test.js'])
		.pipe(karma({
			basePath: '.',
			files: ['app/suso-namespace.js'],
			configFile: './karma.conf.js',
			action: 'run'
		}))
		.on('error', function (err) {
			//throw err;
		});

/*	karma
	karma.start({
		basePath: '.',
		files: ['app/suso-namespace.js'],
		configfile: './karma.conf.js',
		singleRun: true
	}, done);
*/
});

gulp.task('concat', ['lint', 'test'], function () {
	var filesInOrder = [
		'app/suso-namespace.js',
		'app/obj.js',
		'app/obj-query.js',
		'app/obj-grid.js',
		'app/obj-house.js',
		'app/obj-cell.js',
		'app/rule-*.js',
		'app/view-*.js'
	];

	return gulp.src(filesInOrder)
		.pipe(concat('suso.js'))
		.pipe(stripDebug())
		.pipe(gulp.dest('build'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest('build'));
		//.pipe(notify({ message: 'concat & minify complete' }));
});

gulp.task('default', ['lint', 'test', 'concat'], function () {
	// only if lint succeeds
});