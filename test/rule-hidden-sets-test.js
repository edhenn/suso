/*global suso, describe, it, expect, beforeEach */
/*jslint plusplus: true */
/*eslint no-empty-function: 0 */

(function () {
	"use strict";

	describe("rule-hidden-sets member", function () {
		it("exists in suso namespace", function () {
			expect(suso.rules.hiddensets).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof suso.rules.hiddensets).toBe("function");
		});
	});

	describe("rule-hidden-sets function", function () {
		function listSolved(grid) {
			var solved = [], row, cell, rowCells;
			for (row = 0; row < 9; row++) {
				rowCells = grid.row(row).cells();
				for (cell = 0; cell < 9; cell++) {
					if (rowCells[cell].value() !== undefined) {
						solved.push(rowCells[cell]);
					}
				}
			}
			return solved;
		}

		it("does nothing to an empty grid", function () {
			var grid = new suso.Grid();

			suso.rules.hiddensets(grid);

			expect(listSolved(grid).length).toBe(0);
		});

		it("returns false when it does nothing", function () {
			var grid = new suso.Grid(), result = null;

			result = suso.rules.hiddensets(grid);

			expect(result).toBe(false);
		});

		it("removes extraneous possible values from hidden pair in a row", function () {
			var grid = new suso.Grid(),
				progress;								//    012 345 678

			grid.row(1).cells()[8].setValue(4);			// 0  --- --- ---
			grid.row(2).cells()[8].setValue(5);			// 1  --- --- --4
			grid.row(4).cells()[0].setValue(1);			// 2  --- --- --5
			grid.row(4).cells()[1].setValue(2);
			grid.row(4).cells()[5].setValue(6);			// 3  --- --- ---
			grid.row(4).cells()[6].setValue(7);			// 4  12- --6 78- <- hidden pair 4,5 clears poss vals 3,9 from cells 4,5
			grid.row(4).cells()[7].setValue(8);			// 5  --- --- ---
			grid.row(6).cells()[2].setValue(4);
			grid.row(7).cells()[2].setValue(5);			// 6  --4 --- ---
														// 7  --5 --- ---
			progress = suso.rules.hiddensets(grid);	// 8  --- --- ---
			expect(progress).toBe(true);
			expect(grid.row(4).cells()[2].possibleValues()).toEqual([3, 9]);
			expect(grid.row(4).cells()[3].possibleValues()).toEqual([4, 5]);
			expect(grid.row(4).cells()[4].possibleValues()).toEqual([4, 5]);
			expect(grid.row(4).cells()[8].possibleValues()).toEqual([3, 9]);
		});

		it("does nothing when 2 different pairs of possible values exist in a group", function () {
			var grid = new suso.Grid(),
				progress;								//    012 345 678

			grid.row(0).cells()[0].setValue(1);			// 0  123 --- ---
			grid.row(0).cells()[1].setValue(2);			// 1  --- --- ---  <-- cells 0,1,2 should have 5/6, 4/6, 4/5 as poss values.  no pairs.
			grid.row(0).cells()[2].setValue(3);			// 2  789 --- ---
			grid.row(2).cells()[0].setValue(7);
			grid.row(2).cells()[1].setValue(8);			// 3  456 --- ---
			grid.row(2).cells()[2].setValue(9);			// 4  --- --- ---
			grid.row(3).cells()[0].setValue(4);			// 5  --- --- ---
			grid.row(3).cells()[1].setValue(5);
			grid.row(3).cells()[2].setValue(6);			// 6  --- --- ---
														// 7  --- --- ---
			progress = suso.rules.nakedsets(grid, [2]);	// 8  --- --- ---

			expect(progress).toBe(false);
			expect(grid.row(1).cells()[0].possibleValues()).toEqual([5, 6]);
			expect(grid.row(1).cells()[1].possibleValues()).toEqual([4, 6]);
			expect(grid.row(1).cells()[2].possibleValues()).toEqual([4, 5]);
		});
	});

	describe("generalized hidden sets logic", function () {
		var house, cells = [], gridStub = {
			st: "init",
			state: function () { return this.st; },
			allGroups: function () { return [ house ]; },
			seedSolved: [],
			trigger: function () { }
		};

		function possvalCount() {
			var possvals = 0;
			cells.forEach(function (cell) {
				possvals += cell.possibleValues().length;
			});
			return possvals;
		}

		beforeEach(function () {
			var i, cell;

			cells = [];
			house = new suso.House("row", 0, gridStub);

			for (i = 0; i < 9; i++) {
				cell = new suso.Cell(gridStub);
				cells.push(cell);
				cell.setHouse(house);
			}
		});

		it("does nothing when no hidden sets exist & no cells solved", function () {
			var progress;

			progress = suso.rules.hiddensets(gridStub);

			expect(progress).toBe(false);
			expect(possvalCount()).toBe(9 * 9);
		});

		it("does nothing when all cells are solved", function () {
			var progress;

			cells.forEach(function (cell, idx) {
				cell.setValue(idx + 1);
			});

			progress = suso.rules.hiddensets(gridStub);

			expect(progress).toBe(false);
			expect(possvalCount()).toBe(0);
		});

		it("finds one hidden pair", function () {
			var progress;

			cells[0].removePossible(4);		// set up one house with the following unsolved cells, showing possible values:
			cells[1].removePossible(3);		// cell0 : 1, 2, 3,    5
			cells[2].removePossible(1);		// cell1 : 1, 2,    4, 5
			cells[2].removePossible(2);		// cell2 :       3, 4, 5
			cells[3].removePossible(1);		// cell3 :       3, 4, 5
			cells[3].removePossible(2);		// cell4 :       3, 4, 5
			cells[4].removePossible(1);
			cells[4].removePossible(2);		// cells 0 & 1 make a hidden pair of poss vals 1 & 2
			cells[5].setValue(6);			// rule should delete other values from these cells
			cells[6].setValue(7);			// leaving 13 poss values in all cells of house
			cells[7].setValue(8);
			cells[8].setValue(9);

			progress = suso.rules.hiddensets(gridStub);

			expect(progress).toBe(true);
			expect(possvalCount()).toBe(13);
			expect(cells[0].possibleValues()).toEqual([1, 2]);
			expect(cells[1].possibleValues()).toEqual([1, 2]);
			expect(cells[2].possibleValues()).toEqual([3, 4, 5]);
			expect(cells[3].possibleValues()).toEqual([3, 4, 5]);
			expect(cells[4].possibleValues()).toEqual([3, 4, 5]);
		});

		it("finds one hidden triplet", function () {
			var progress;

			cells[0].setValue(5);			// set up one house with the following unsolved cells, showing possible values:
			cells[1].removePossible(4);		// cell1 : 1, 2, 3,    9
			cells[2].removePossible(1);		// cell2 :          4, 9
			cells[2].removePossible(2);		// cell3 : 1, 2,       9
			cells[2].removePossible(3);		// cell4 :    2, 3, 4, 9
			cells[3].removePossible(3);		// cell5 :          4, 9
			cells[3].removePossible(4);
			cells[4].removePossible(1);		// cells 1, 3, 4 make a hidden triplet containing poss vals 1, 2, 3
			cells[5].removePossible(1);		// hidden sets rule should delete other possible values from these cells
			cells[5].removePossible(2);		// i.e. remove from cell1: 9, cell3: 9, cell4: 4, 9
			cells[5].removePossible(3);		// leaving 11 possible values
			cells[6].setValue(6);
			cells[7].setValue(7);
			cells[8].setValue(8);

			progress = suso.rules.hiddensets(gridStub);

			expect(progress).toBe(true);
			expect(possvalCount()).toBe(11);
			expect(cells[1].possibleValues()).toEqual([1, 2, 3]);
			expect(cells[2].possibleValues()).toEqual([4, 9]);
			expect(cells[3].possibleValues()).toEqual([1, 2]);
			expect(cells[4].possibleValues()).toEqual([2, 3]);
			expect(cells[5].possibleValues()).toEqual([4, 9]);
		});

		it("finds one hidden quad with no cell having all 4", function () {
			var progress;

			cells[0].removePossible(1);		// set up one house with the following unsolved cells, showing possible values:
			cells[0].removePossible(2);		// cell0 :             5, 6
			cells[0].removePossible(3);		// cell1 : 1, 2
			cells[0].removePossible(4);		// cell2 :    2, 3,       6
			cells[1].removePossible(3);		// cell3 :       3, 4, 5
			cells[1].removePossible(4);		// cell4 : 1,       4, 5
			cells[1].removePossible(5);		// cell5 :             5, 6
			cells[1].removePossible(6);
			cells[2].removePossible(1);		// cells 1, 2, 3, 4 make a hidden quad of poss vals 1, 2, 3, 4.
			cells[2].removePossible(4);		// rule should delete all other poss vals from these cells
			cells[2].removePossible(5);		// leaving 12 possible values in all cells of house
			cells[3].removePossible(1);
			cells[3].removePossible(2);
			cells[3].removePossible(6);
			cells[4].removePossible(2);
			cells[4].removePossible(3);
			cells[4].removePossible(6);
			cells[5].removePossible(1);
			cells[5].removePossible(2);
			cells[5].removePossible(3);
			cells[5].removePossible(4);
			cells[6].setValue(7);
			cells[7].setValue(8);
			cells[8].setValue(9);

			progress = suso.rules.hiddensets(gridStub, [2, 3, 4]);

			expect(progress).toBe(true);
			expect(possvalCount()).toBe(12);
			expect(cells[0].possibleValues()).toEqual([5, 6]);
			expect(cells[1].possibleValues()).toEqual([1, 2]);
			expect(cells[2].possibleValues()).toEqual([2, 3]);
			expect(cells[3].possibleValues()).toEqual([3, 4]);
			expect(cells[4].possibleValues()).toEqual([1, 4]);
			expect(cells[5].possibleValues()).toEqual([5, 6]);
		});
	});
}());
