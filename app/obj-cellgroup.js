/*global jsobj */
/*jslint */

(function (jsobj) {
	"use strict";

	function CellGroup() {
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

	jsobj.CellGroup = function () {
		return jsobj.EventAware(new CellGroup());
	};
}(jsobj));