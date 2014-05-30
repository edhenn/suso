/*global jsobj */
/*jslint plusplus: true */

(function (jsobj) {
	"use strict";

	if (jsobj.rules === undefined) {
		jsobj.rules = {};
	}

	jsobj.rules.pairs = function (grid) {
		var progress = false;

		// rules return boolean indicating whether they made any progress
		return progress;
	};
}(jsobj));