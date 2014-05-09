/*global jsobj */
/*jslint */

(function (jsobj) {
	"use strict";

	function Row() {
		var cells = [], that = this;

		this.addCell = function (cell) {
			cells.push(cell);
			cell.on("update", function () {
				that.trigger("update", this.value());
			});
		};

		this.cells = function () {
			return cells;
		};
	}

	Row.prototype = new jsobj.EventAware();

	jsobj.Row = function () {
		return new Row();
	};
}(jsobj));