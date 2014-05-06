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
			if (val !== undefined) {
				throw new Error("Attempt to set value on a Cell that already has a value.");
			}
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