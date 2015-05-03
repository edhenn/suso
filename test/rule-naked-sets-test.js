/*global suso, describe, it, expect */
/*jslint plusplus: true */

(function () {
	"use strict";

	describe("rule-pairs member", function () {
		it("exists in suso namespace", function () {
			expect(suso.rules.nakedsets).toBeDefined();
		});

		it("is a function", function () {
			expect(typeof suso.rules.nakedsets).toBe("function");
		});
	});

	describe("rule-pairs function", function () {
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

			suso.rules.nakedsets(grid);

			expect(listSolved(grid).length).toBe(0);
		});

		it("returns false when it does nothing", function () {
			var grid = new suso.Grid(), result;

			result = suso.rules.nakedsets(grid);

			expect(result).toBe(false);
		});

		it("removes pairs of possible values from a row when two cells in row have same pair of possible values", function () {
			var grid = new suso.Grid(),
				progress;								//    012 345 678

			grid.row(0).cells()[0].setValue(1);			// 0  123 --- ---
			grid.row(0).cells()[1].setValue(2);			// 1  --6 --- ---  <-- should remove possible vals
			grid.row(0).cells()[2].setValue(3);			// 2  789 --- ---		4 & 5 in cells 3-8.
			grid.row(1).cells()[2].setValue(6);
			grid.row(2).cells()[0].setValue(7);			// 3  --- --- ---
			grid.row(2).cells()[1].setValue(8);			// 4  --- --- ---
			grid.row(2).cells()[2].setValue(9);			// 5  --- --- ---

			progress = suso.rules.nakedsets(grid);			// 6  --- --- ---
														// 7  --- --- ---
			expect(progress).toBe(true);				// 8  --- --- ---
			expect(grid.row(1).cells()[0].possibleValues()).toEqual([4, 5]);
			expect(grid.row(1).cells()[1].possibleValues()).toEqual([4, 5]);
			expect(grid.row(1).cells()[3].possibleValues()).toEqual([1, 2, 3, 7, 8, 9]);
			expect(grid.row(1).cells()[4].possibleValues()).toEqual([1, 2, 3, 7, 8, 9]);
			expect(grid.row(1).cells()[5].possibleValues()).toEqual([1, 2, 3, 7, 8, 9]);
			expect(grid.row(1).cells()[6].possibleValues()).toEqual([1, 2, 3, 7, 8, 9]);
			expect(grid.row(1).cells()[7].possibleValues()).toEqual([1, 2, 3, 7, 8, 9]);
			expect(grid.row(1).cells()[8].possibleValues()).toEqual([1, 2, 3, 7, 8, 9]);
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

	describe("old triples rule tests, using naked sets rule limited to triples", function () {
		it("removes possible values from a row when three cells in row have same triplet of possible values", function () {
			var grid = new suso.Grid(),
				progress;								//    012 345 678

			grid.row(0).cells()[2].setValue(7);			// 0  --7 234 ---	<- this row should not have 1,5,9 in last 2 cells
			grid.row(0).cells()[3].setValue(2);			// 1  6-- --- ---
			grid.row(0).cells()[4].setValue(3);			// 2  8-- --- ---
			grid.row(0).cells()[5].setValue(4);
			grid.row(1).cells()[0].setValue(6);			// 3  -6- --- -51
			grid.row(2).cells()[0].setValue(8);			// 4  -8- --- ---
			grid.row(3).cells()[1].setValue(6);			// 5  --- --- ---
			grid.row(3).cells()[7].setValue(5);
			grid.row(3).cells()[8].setValue(1);			// 6  --- --- 6--
			grid.row(4).cells()[1].setValue(8);			// 7  --- --- 8--
			grid.row(6).cells()[6].setValue(6);			// 8  --- --- ---
			grid.row(7).cells()[6].setValue(8);

			progress = suso.rules.nakedsets(grid, [3]);

			expect(progress).toBe(true);
			expect(grid.row(0).cells()[0].possibleValues()).toEqual([1, 5, 9]);
			expect(grid.row(0).cells()[1].possibleValues()).toEqual([1, 5, 9]);
			expect(grid.row(0).cells()[6].possibleValues()).toEqual([1, 5, 9]);
			expect(grid.row(0).cells()[7].possibleValues()).toEqual([6, 8]);
			expect(grid.row(0).cells()[8].possibleValues()).toEqual([6, 8]);
		});

		it("removes possible values from a row when three cells in row share same triplet of possible values in three pairs", function () {
			var grid = new suso.Grid(),
				progress;								//    012 345 678

			grid.row(0).cells()[2].setValue(7);			// 0  --7 234 ---	<- this row should not have 1,5,9 in last 2 cells
			grid.row(0).cells()[3].setValue(2);			// 1  6-- --- ---
			grid.row(0).cells()[4].setValue(3);			// 2  8-- --- ---
			grid.row(0).cells()[5].setValue(4);
			grid.row(1).cells()[0].setValue(6);			// 3  -6- --- -51
			grid.row(2).cells()[0].setValue(8);			// 4  -8- --- ---
			grid.row(3).cells()[1].setValue(6);			// 5  15- --- 9--
			grid.row(3).cells()[7].setValue(5);
			grid.row(3).cells()[8].setValue(1);			// 6  --- --- 6--
			grid.row(4).cells()[1].setValue(8);			// 7  --- --- 8--
			grid.row(5).cells()[0].setValue(1);			// 8  --- --- ---
			grid.row(5).cells()[1].setValue(5);
			grid.row(5).cells()[6].setValue(9);
			grid.row(6).cells()[6].setValue(6);
			grid.row(7).cells()[6].setValue(8);

			progress = suso.rules.nakedsets(grid, [3]);

			expect(progress).toBe(true);
			expect(grid.row(0).cells()[0].possibleValues()).toEqual([5, 9]);
			expect(grid.row(0).cells()[1].possibleValues()).toEqual([1, 9]);
			expect(grid.row(0).cells()[6].possibleValues()).toEqual([1, 5]);
			expect(grid.row(0).cells()[7].possibleValues()).toEqual([6, 8]);
			expect(grid.row(0).cells()[8].possibleValues()).toEqual([6, 8]);
		});
	});
}());
