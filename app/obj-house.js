/*global suso */
/*jslint plusplus: true */

(function (suso) {
	"use strict";

	function House(type, num, grid) {
		var cells = [],
			possibles = { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null, length: 9 },
			that = this;

		function updatePossibles(updatedCell) {
			var newValue = updatedCell.value();
			if (possibles[newValue] !== undefined) {
				delete possibles[newValue];
				possibles.length--;
			} else {
				throw new Error("Attempt to set a Cell to a value not contained in House's possibles list.");
			}
		}

		this.possibles = possibles;
		this.possibleValues = function () {
			var i, poss = [];
			for (i = 1; i < 10; i++) {
				if (possibles.hasOwnProperty(i)) {
					poss.push(i);
				}
			}
			return poss;
		};

		this.addCell = function (cell) {
			cells.push(cell);
			cell.on("update", function () {
				that.trigger("update", this);	// passes solved cell to listeners
				updatePossibles(this);
			});
			return that;
		};

		this.grid = function () {
			return grid;
		};

		this.type = function () {
			return type;
		};

		this.num = function () {
			return num;
		};

		this.cells = function () {
			return cells;
		};

		this.name = function () {
			return type + " " + num.toString();
		};
	}

	suso.House = function (type, num, grid) {
		return suso.EventAware(new House(type, num, grid));
	};
}(suso));