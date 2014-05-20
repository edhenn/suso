/*global jsobj */
/*jslint plusplus: true */

(function (jsobj) {
	"use strict";

	var cellnum = 0;

	function Cell(id, grid) {
		var cellId = id, val, myRowH, myRowV, myBlock,
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
				if (possibleCount === 1 && grid.state() === 'ready') {
					// grid is ready - done seeding. auto-solve cells with one remaining possible value.
					that.setValue(that.possibleValues()[0]);
				}
			}
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
			possibles = {};
			possibleCount = 0;
			this.trigger("update");
		};

		this.rowH = function () {
			return myRowH;
		};

		this.setRowH = function (row) {
			if (myRowH !== undefined) {
				throw new Error('Attempt to set rowH on a Cell that already has a rowH.');
			}
			myRowH = row;
			myRowH.addCell(this);

			// update possible values of the cell when its row is updated
			myRowH.on("update", updatePossibles);
		};

		this.rowV = function () {
			return myRowV;
		};

		this.setRowV = function (row) {
			if (myRowV !== undefined) {
				throw new Error('Attempt to set rowV on a Cell that already has a rowV.');
			}
			myRowV = row;
			myRowV.addCell(this);

			// update possible values of the cell when its row is updated
			myRowV.on("update", updatePossibles);
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

		this.coords = function () {
			if (myRowH === undefined || myRowV === undefined) {
				return [];
			}
			return [ myRowH.num(), myRowV.num() ];
		};
	}

	jsobj.Cell = function (grid) {
		return jsobj.EventAware(new Cell(cellnum++, grid));
	};
}(jsobj));