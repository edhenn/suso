/*global require */
/*jslint node: true*/

"use strict";

var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')({
		pattern: ['gulp-*', 'plato'],
		rename: {
			'gulp-tag-version': 'version'
		}
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
	return gulp.src(appFilesInOrder.concat(testFiles))
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

function addBuildsToNextGitCommit() {
	return gulp.src(['build/*.js'])
		.pipe(plugins.git.add());
}

function incrementVersion(versionType) {
	var buildFiles = 'build/*.js',
		packageFiles = '*.json',
		packageFilter = plugins.filter(packageFiles);

    // get all the files to commit
    return gulp.src([buildFiles, packageFiles])
		.pipe(packageFilter)							// filter down to packageFiles
		.pipe(plugins.bump({ type: versionType }))		// bump requested version number
		.pipe(gulp.dest('./'))							// save back to filesystem
		.pipe(packageFilter.restore())					// un-filter to include build files
		.pipe(plugins.git.commit('gulp-tag-version'))	// commit changed version number and build files
		.pipe(plugins.filter('package.json'))			// read only one file to get the version number
		.pipe(plugins.version());						// **tag it in the repository**
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