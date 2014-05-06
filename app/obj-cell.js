/*global jsobj */
/*jslint */

(function (jsobj) {
	"use strict";

	jsobj.Cell = function () {
		var val, myrow;

		this.prototype = new jsobj.EventAware();

		this.value = function () {
			return val;
		};

		this.setValue = function (newValue) {
			val = newValue;
		};

		this.row = function () {
			return myrow;
		};

		this.setRow = function (row) {
			myrow = row;
		};
	};
}(jsobj));