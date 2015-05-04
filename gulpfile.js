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

gulp.task('complex', ['test'], function () {
	var outputDir = './reports',
		callback = function () {
		};

	plugins.plato.inspect(appFilesInOrder, outputDir, {}, callback);
});

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
gulp.task('patch', ['complex'], function () {
	return incrementVersion('patch');
});

// package and bump semver feature number in npm and bower configs
gulp.task('feature', ['complex'], function () {
	return incrementVersion('minor');
});

// package and bump semver release number in npm and bower configs
gulp.task('release', ['complex'], function () {
	return incrementVersion('major');
});

function makePackage() {
	var fs = require('fs'),
		pjson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

	fs.writeFile('app/suso-namespace.js',
		'/*eslint no-unused-vars: 0*/\nvar suso = {\n\trules: {},\n\tviews: {},\n\tversion: \"' +
		pjson.version
		+ '\"\n};\n');

	return gulp.src(appFilesInOrder)
		.pipe(plugins.concat('suso.js'))
		.pipe(plugins.stripDebug())
		.pipe(gulp.dest('build'))
		.pipe(plugins.rename({ suffix: '.min' }))
		.pipe(plugins.uglify())
		.pipe(gulp.dest('build'))
		.pipe(gulp.dest('demo'));
}

gulp.task('package', ['patch'], function () {
	return makePackage();
});

gulp.task('package-minor', ['feature'], function () {
	return makePackage();
});

gulp.task('package-major', ['release'], function () {
	return makePackage();
});

gulp.task('default', ['lint', 'test'], function () {
	// only if lint succeeds
});