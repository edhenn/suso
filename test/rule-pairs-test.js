/*global suso, describe, it, xit, expect, beforeEach */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("rule-pairs member", function () {
		it("exists in suso namespace", function () {
			expect(suso.rules.pairs).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof suso.rules.pairs).toBe("function");
		});
	});

	describe("rule-pairs function", function () {
		function listSolved(grid) {
			var solved = [], row, cell, rowCells;
			for (row = 0; row < 9; row++) {
				rowCells = grid.hRow(row).cells();
				for (cell = 0; cell < 9; cell++) {
					if (rowCells[cell].value() !== undefined) {
						solved.push(rowCells[cell]);
					}
				}
			}
			return solved;
		}

		function arraysAreEqual(a, b) {

		}

		it("does nothing to an empty grid", function () {
			var grid = new suso.Grid(), result = null;

			result = suso.rules.pairs(grid);

			expect(listSolved(grid).length).toBe(0);
		});

		it("returns false when it does nothing", function () {
			var grid = new suso.Grid(), result = null;

			result = suso.rules.pairs(grid);

			expect(result).toBe(false);
		});

		it("removes pairs of possible values from a row when two cells in row have same pair of possible values", function () {
			var grid = new suso.Grid(),
				progress,
				solved,
				poss;										//    012 345 678

			grid.hRow(0).cells()[0].setValue(1);			// 0  123 --- ---
			grid.hRow(0).cells()[1].setValue(2);			// 1  --6 --- ---  <-- this row should not have possible vals 4,5 in cells 4-9.
			grid.hRow(0).cells()[2].setValue(3);			// 2  789 --- ---
			grid.hRow(1).cells()[2].setValue(6);
			grid.hRow(2).cells()[0].setValue(7);			// 3  --- --- ---
			grid.hRow(2).cells()[1].setValue(8);			// 4  --- --- ---
			grid.hRow(2).cells()[2].setValue(9);			// 5  --- --- ---

			progress = suso.rules.pairs(grid);				// 6  --- --- ---
															// 7  --- --- ---
			expect(progress).toBe(true);					// 8  --- --- ---
			expect(grid.hRow(1).cells()[0].possibleValues()).toEqual([4, 5]);
			expect(grid.hRow(1).cells()[1].possibleValues()).toEqual([4, 5]);
			expect(grid.hRow(1).cells()[3].possibleValues()).toEqual([1, 2, 3, 7, 8, 9]);
			expect(grid.hRow(1).cells()[4].possibleValues()).toEqual([1, 2, 3, 7, 8, 9]);
			expect(grid.hRow(1).cells()[5].possibleValues()).toEqual([1, 2, 3, 7, 8, 9]);
			expect(grid.hRow(1).cells()[6].possibleValues()).toEqual([1, 2, 3, 7, 8, 9]);
			expect(grid.hRow(1).cells()[7].possibleValues()).toEqual([1, 2, 3, 7, 8, 9]);
			expect(grid.hRow(1).cells()[8].possibleValues()).toEqual([1, 2, 3, 7, 8, 9]);
		});

		it("does nothing when 2 different pairs of possible values exist in a group", function () {
			var grid = new suso.Grid(),
				progress,
				solved,
				poss;										//    012 345 678

			grid.hRow(0).cells()[0].setValue(1);			// 0  123 --- ---
			grid.hRow(0).cells()[1].setValue(2);			// 1  --- --- ---  <-- cells 0,1,2 should have 5/6, 4/6, 4/5 as poss values.  no pairs.
			grid.hRow(0).cells()[2].setValue(3);			// 2  789 --- ---
			grid.hRow(2).cells()[0].setValue(7);
			grid.hRow(2).cells()[1].setValue(8);			// 3  456 --- ---
			grid.hRow(2).cells()[2].setValue(9);			// 4  --- --- ---
			grid.hRow(3).cells()[0].setValue(4);			// 5  --- --- ---
			grid.hRow(3).cells()[1].setValue(5);
			grid.hRow(3).cells()[2].setValue(6);			// 6  --- --- ---
															// 7  --- --- ---
			progress = suso.rules.pairs(grid);				// 8  --- --- ---

			expect(progress).toBe(false);
			expect(grid.hRow(1).cells()[0].possibleValues()).toEqual([5, 6]);
			expect(grid.hRow(1).cells()[1].possibleValues()).toEqual([4, 6]);
			expect(grid.hRow(1).cells()[2].possibleValues()).toEqual([4, 5]);
		});
	});
}());