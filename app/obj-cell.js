/*global jsobj */
/*jslint plusplus: true, bitwise: true */

(function (jsobj) {
	"use strict";

	var cellnum = 0;

	function Cell(id, grid) {
		var cellId = id, val, myRow, myCol, myBlock,
			possibles = { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null },
			possibleCount = 9,
			that = this;

		function updatePossibles(updatedCell) {
			var newValue = updatedCell.value();
			that.removePossible(newValue);
		}

		this.id = function () {
			return cellId;
		};

		this.possibles = possibles;

		this.removePossible = function (value) {
			if (possibles[value] !== undefined) {
				delete possibles[value];
				possibleCount--;
				if (possibleCount === 1) {
					// grid is ready - done seeding. auto-solve cells with one remaining possible value.
					if (grid.state() === 'ready') {
						that.setValue(that.possibleValues()[0]);
					} else {
						grid.seedSolved.push(that);
					}
				}
				return true;
			}
			return false;
		};

		this.grid = function () {
			return grid;
		};

		this.value = function () {
			return val;
		};

		this.setValue = function (newValue) {
			if (val !== undefined) {
				throw new Error("Attempt to set value on a Cell that already has a value.");
			}
			val = newValue;
			that.possibles = possibles = {};
			possibleCount = 0;
			this.trigger("update");
		};

		this.row = function () {
			return myRow;
		};

		this.setRow = function (row) {
			if (myRow !== undefined) {
				throw new Error('Attempt to set row on a Cell that already has a row.');
			}
			myRow = row;
			myRow.addCell(this);

			// update possible values of the cell when its row is updated
			myRow.on("update", updatePossibles);
		};

		this.col = function () {
			return myCol;
		};

		this.setCol = function (row) {
			if (myCol !== undefined) {
				throw new Error('Attempt to set col on a Cell that already has a col.');
			}
			myCol = row;
			myCol.addCell(this);

			// update possible values of the cell when its row is updated
			myCol.on("update", updatePossibles);
		};

		this.block = function () {
			return myBlock;
		};

		this.setBlock = function (block) {
			if (myBlock !== undefined) {
				throw new Error('Attempt to set block on a Cell that already has a block.');
			}
			myBlock = block;
			myBlock.addCell(this);

			// update possible values of the cell when its row is updated
			myBlock.on("update", updatePossibles);
		};

		this.possibleValues = function () {
			var i, poss = [];
			for (i = 1; i < 10; i++) {
				if (possibles.hasOwnProperty(i)) {
					poss.push(i);
				}
			}
			return poss;
		};

		this.possibleFlags = function () {
			var i, flags = 0;
			for (i = 1; i < 10; i++) {
				flags = (flags << 1) | (possibles.hasOwnProperty(i) ? 1 : 0);
			}
			return flags;
		};

		this.coords = function () {
			if (myRow === undefined || myCol === undefined) {
				return [];
			}
			return [ myRow.num(), myCol.num() ];
		};
	}

	jsobj.Cell = function (grid) {
		return jsobj.EventAware(new Cell(cellnum++, grid));
	};
}(jsobj));