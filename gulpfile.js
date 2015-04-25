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

// package normal and minified version in build/ directory
gulp.task('package', ['lint', 'test', 'complex'], function () {
	return gulp.src(appFilesInOrder)
		.pipe(plugins.concat('suso.js'))
		.pipe(plugins.stripDebug())
		.pipe(gulp.dest('build'))
		.pipe(plugins.rename({ suffix: '.min' }))
		.pipe(plugins.uglify())
		.pipe(gulp.dest('build'));
});

function incrementVersion(versionType) {
    // get all the files to bump version in
    return gulp.src(['./package.json', './bower.json'])
		// bump the version number in those files
		.pipe(plugins.bump({ type: versionType }))
		// save it back to filesystem
		.pipe(gulp.dest('./'))
		// commit the changed version number
		.pipe(plugins.git.commit('update package version (gulp-tag-version)'))
		 // read only one file to get the version number
		.pipe(plugins.filter('package.json'))
		// **tag it in the repository**
		.pipe(plugins.tag_version());
}

// package and bump semver patch number in npm and bower configs
gulp.task('patch', ['package'], function () {
	return incrementVersion('patch');
});

// package and bump semver feature number in npm and bower configs
gulp.task('feature', ['package'], function () {
	return incrementVersion('minor');
});

// package and bump semver release number in npm and bower configs
gulp.task('release', ['package'], function () {
	return incrementVersion('major');
});

gulp.task('default', ['lint', 'test'], function () {
	// only if lint succeeds
});