/*global require */

var gulp = require('gulp'),
	eslint = require('gulp-eslint'),
	karma = require('gulp-karma'),
	concat = require('gulp-concat'),
	stripDebug = require('gulp-strip-debug'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify'),
	uglify = require('gulp-uglify'),
	appFilesInOrder = [
		'app/suso-namespace.js',
		'app/obj.js',
		'app/obj-query.js',
		'app/obj-grid.js',
		'app/obj-house.js',
		'app/obj-cell.js',
		'app/rule-*.js',
		'app/view-*.js'
	],
	testFiles = ['test/*.js'];

gulp.task('lint', function () {
	return gulp.src(appFilesInOrder)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

gulp.task('test', ['lint'], function (done) {
	var sourceAndTestFiles = appFilesInOrder.concat(testFiles);

	// gulp-karma
	return gulp.src(sourceAndTestFiles)
		.pipe(karma({
			configFile: './karma.conf.js',
			action: 'run'
		}))
		.on('error', function (err) {
			//throw err;
		});
});

gulp.task('concat', ['lint', 'test'], function () {
	return gulp.src(appFilesInOrder)
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