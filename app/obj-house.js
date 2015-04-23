/*global suso */
/*jslint plusplus: true, bitwise: true */
/*eslint plusplus: true, bitwise: true */

(function (suso) {
	"use strict";

	function House(type, num, grid) {
		var cells = [],
			possibles = Math.pow(2, 9) - 1,
			possiblesRemaining = 9,
			that = this;

		function hasPossible(value) {
			var valueFlag = Math.pow(2, 9 - value);
			return (possibles & valueFlag) === valueFlag;
		}

		function updatePossibles(updatedCell) {
			var newValue = updatedCell.value();
			if (hasPossible(newValue)) {
				possibles = possibles ^ Math.pow(2, 9 - newValue);
				possiblesRemaining--;
			} else {
				throw new Error("Attempt to set a Cell to a value not contained in House's possibles list.");
			}
		}

		function cellUpdate() {
			that.trigger("update", this);	// passes solved cell to listeners
			updatePossibles(this);
		}

		this.possibleValues = function () {
			var i, poss = [];
			for (i = 1; i < 10; i++) {
				if (hasPossible(i)) {
					poss.push(i);
				}
			}
			return poss;
		};

		this.addCell = function (cell) {
			cells.push(cell);
			cell.on("update", cellUpdate);
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

		this.releaseCell = function (cell) {
			cell.off("update", cellUpdate);
		};
	}

	suso.House = function (type, num, grid) {
		return new suso.EventAware(new House(type, num, grid));
	};
}(suso));
