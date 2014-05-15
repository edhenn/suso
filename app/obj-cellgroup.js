/*global jsobj */
/*jslint */

(function (jsobj) {
	"use strict";

	function CellGroup(name) {
		var cells = [], myname = name, that = this;

		this.addCell = function (cell) {
			cells.push(cell);
			cell.on("update", function () {
				that.trigger("update", this.value());
			});
		};

		this.cells = function () {
			return cells;
		};

		this.name = function () {
			return myname;
		};
	}

	jsobj.CellGroup = function (name) {
		return jsobj.EventAware(new CellGroup(name));
	};
}(jsobj));