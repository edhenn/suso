/*global suso */
/*jslint plusplus: true, bitwise: true */
/*eslint plusplus: true, bitwise: true */

(function (suso) {
	"use strict";

	var cellnum = 0;

	function Cell(id, grid) {
		var cellId = id, val, myHouses = [],
			houseNums = { "row": 0, "col": 1, "block": 2 },
			possibles = { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null, 7: null, 8: null, 9: null },
			possibleCount = 9,
			seed = false,
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
					if (grid.state() === "ready") {
						that.setValue(that.possibleValues()[0], "last remaining possible value in cell");
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

		this.isSeed = function () {
			return seed;
		};

		this.setValue = function (newValue, note) {
			if (val !== undefined) {
				throw new Error("Attempt to set value on a Cell that already has a value.");
			}
			if (grid.state() === "unseeded") {
				seed = true;
			}
			val = newValue;
			that.possibles = possibles = {};
			possibleCount = 0;
			this.trigger("update", this, note);
		};

		this.setHouse = function (house) {
			var houseNum = houseNums[house.type()];

			if (houseNum === undefined) {
				throw new Error("invalid house");
			}

			if (myHouses[houseNum] !== undefined) {
				throw new Error("Attempt to set " + house.type() + " on a Cell that already has a " + house.type() + ".");
			}

			myHouses[houseNum] = house;
			house.addCell(this);

			// update possible values of the cell when its house is updated
			house.on("update", updatePossibles);
		};

		this.row = function () {
			return myHouses[houseNums.row];
		};

		this.col = function () {
			return myHouses[houseNums.col];
		};

		this.block = function () {
			return myHouses[houseNums.block];
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
			if (myHouses[houseNums.row] === undefined || myHouses[houseNums.col] === undefined) {
				return [];
			}
			return [ myHouses[houseNums.row].num(), myHouses[houseNums.col].num() ];
		};

		this.release = function () {
			that.row().off("update");
			that.col().off("update");
			that.block().off("update");
		};
	}

	suso.Cell = function (grid) {
		return new suso.EventAware(new Cell(cellnum++, grid));
	};
}(suso));
