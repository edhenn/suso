// Karma configuration
// Generated on Thu Apr 24 2014 21:28:47 GMT-0700 (Pacific Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine"],


    // list of files / patterns to load in the browser
    files: [
	  'app/suso-namespace.js',
      'app/obj.js',
	  'app/obj-query.js',
	  'app/obj-grid.js',
	  'app/obj-house.js',
      'app/obj-cell.js',
	  'app/rule-last-in-group.js',
	  'app/rule-restricted-possible-value.js',
	  'app/rule-naked-sets.js',
	  'app/rule-hidden-sets.js',
	  'app/rule-x-wing.js',
	  'app/view-preformatted.js',
	  'app/view-static-grid.js',
	  'app/view-input-grid.js',
	  'app/view-report.js',
	  'test/*.js'
    ],


    // list of files to exclude
    exclude: [
      
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
		'app/*.js': ['coverage']
    },


    // test results reporter to use
    // possible values: "dots", "progress"
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

	coverageReporter: {
		type: 'html',
		dir: 'coverage/'
	},

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["PhantomJS"],	// "PhantomJS" // "Firefox", "IE", "Chrome",	// ["karma-detect-browsers"],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
