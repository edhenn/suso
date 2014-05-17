/*global jsobj */
/*jslint */

(function (jsobj) {
	"use strict";

	function CellGroup(type, num, grid) {
		var cells = [], that = this;

		this.addCell = function (cell) {
			cells.push(cell);
			cell.on("update", function () {
				that.trigger("update", this);	// passes solved cell to listeners
			});
			return that;
		};

		this.grid = function () {
			return grid;
		};

		this.type = function () {
			return type;
		};

		this.cells = function () {
			return cells;
		};

		this.name = function () {
			return type + ' ' + num.toString();
		};
	}

	jsobj.CellGroup = function (type, num, grid) {
		return jsobj.EventAware(new CellGroup(type, num, grid));
	};
}(jsobj));