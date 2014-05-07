/*global jsobj */
/*jslint */

(function (jsobj) {
	"use strict";

	jsobj.Cell = function () {
		var val, myRowH, myRowV, myBlock;

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

		this.rowH = function () {
			return myRowH;
		};

		this.setRowH = function (row) {
			myRowH = row;
		};

		this.rowV = function () {
			return myRowV;
		};

		this.setRowV = function (row) {
			myRowV = row;
		};

		this.block = function () {
			return myBlock;
		};

		this.setBlock = function (block) {
			myBlock = block;
		};
	};
}(jsobj));