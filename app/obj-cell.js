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
			if (myRowH !== undefined) {
				throw new Error('Attempt to set rowH on a Cell that already has a rowH.');
			}
			myRowH = row;
		};

		this.rowV = function () {
			return myRowV;
		};

		this.setRowV = function (row) {
			if (myRowV !== undefined) {
				throw new Error('Attempt to set rowV on a Cell that already has a rowV.');
			}
			myRowV = row;
		};

		this.block = function () {
			return myBlock;
		};

		this.setBlock = function (block) {
			if (myBlock !== undefined) {
				throw new Error('Attempt to set block on a Cell that already has a block.');
			}
			myBlock = block;
		};
	};
}(jsobj));