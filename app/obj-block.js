/*global jsobj */
/*jslint */

(function (jsobj) {
	"use strict";

	function Block() {
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

	Block.prototype = new jsobj.EventAware();

	jsobj.Block = function () {
		return new Block();
	};
}(jsobj));