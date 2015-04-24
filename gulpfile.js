/*global require */
/*jslint node: true*/

"use strict";

var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'plato']
	}),
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
		.pipe(plugins.eslint())
		.pipe(plugins.eslint.format())
		.pipe(plugins.eslint.failOnError());
});

gulp.task('test', ['lint'], function () {
	var sourceAndTestFiles = appFilesInOrder.concat(testFiles);

	// gulp-karma
	return gulp.src(sourceAndTestFiles)
		.pipe(plugins.karma({
			configFile: './karma.conf.js',
			action: 'run'
		}))
		.on('error', function () {
			//throw err;
		});
});

gulp.task('complex', ['test', 'lint'], function () {
	var outputDir = './reports',
		callback = function () {
		};

	plugins.plato.inspect(appFilesInOrder, outputDir, {}, callback);
});

gulp.task('bump', ['lint', 'test'], function () {
	return gulp.src('./package.json')
		.pipe(plugins.bump())
		.pipe(gulp.dest('./'));
});

gulp.task('bump-minor', ['lint', 'test'], function () {
	return gulp.src('./package.json')
		.pipe(plugins.bump({ type: 'minor' }))
		.pipe(gulp.dest('./'));
});

gulp.task('bump-major', ['lint', 'test'], function () {
	return gulp.src('./package.json')
		.pipe(plugins.bump({ type: 'major' }))
		.pipe(gulp.dest('./'));
});

function runpackage() {
	return gulp.src(appFilesInOrder)
		.pipe(plugins.concat('suso.js'))
		.pipe(plugins.stripDebug())
		.pipe(gulp.dest('build'))
		.pipe(plugins.rename({ suffix: '.min' }))
		.pipe(plugins.uglify())
		.pipe(gulp.dest('build'));
}

// package auto-bumps semver patch number; gulp bump-minor or bump-major manually as desired
gulp.task('package', ['lint', 'test', 'complex', 'bump'], function () {
	return runpackage();
});

gulp.task('package-minor', ['lint', 'test', 'complex', 'bump-minor'], function () {
	return runpackage();
});

gulp.task('package-major', ['lint', 'test', 'complex', 'bump-major'], function () {
	return runpackage();
});

gulp.task('default', ['lint', 'test'], function () {
	// only if lint succeeds
});